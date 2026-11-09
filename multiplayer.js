// Empire City multiplayer: a tiny dependency-free WebSocket relay (RFC 6455).
// Everyone shares one city. Clients stream their own position/car/look; the server
// relays it to everybody else ~10 times a second and relays chat messages.
const crypto = require('crypto');

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_PLAYERS = +process.env.MAX_PLAYERS || 60;   // hard cap on simultaneous players
const MAX_FRAME = 8192;                               // biggest message we accept (bytes)
const TICK_MS = 100;                                  // broadcast rate (10 Hz)
const LOOK_KEYS = ['skin', 'hair', 'hs', 'beard', 'top', 'tc', 'bot', 'bc', 'shoeT', 'shoe', 'hat', 'hc', 'gl', 'bp', 'ch', 'mask', 'build'];

module.exports = function attach(server, { read, same, OKN }) {
  const clients = new Map();        // id -> client
  const byName = new Map();         // lowercase account name -> client
  const dirty = new Set();          // clients whose state changed since last tick
  let nextId = 1;

  // ---------- WebSocket framing ----------
  function frame(op, payload) {
    const len = payload.length;
    let head;
    if (len < 126) head = Buffer.from([0x80 | op, len]);
    else if (len < 65536) { head = Buffer.alloc(4); head[0] = 0x80 | op; head[1] = 126; head.writeUInt16BE(len, 2); }
    else { head = Buffer.alloc(10); head[0] = 0x80 | op; head[1] = 127; head.writeBigUInt64BE(BigInt(len), 2); }
    return Buffer.concat([head, payload]);
  }
  function raw(c, buf) { if (!c.dead && c.sock.writable) { try { c.sock.write(buf); } catch (e) { drop(c); } } }
  function send(c, obj) { raw(c, frame(1, Buffer.from(typeof obj === 'string' ? obj : JSON.stringify(obj)))); }
  function broadcast(obj, except) {
    const buf = frame(1, Buffer.from(typeof obj === 'string' ? obj : JSON.stringify(obj)));
    for (const c of clients.values()) if (c !== except && c.joined) raw(c, buf);
  }
  function drop(c, code) {
    if (c.dead) return;
    c.dead = true;
    try { if (code) c.sock.write(frame(8, Buffer.from([code >> 8, code & 255]))); } catch (e) {}
    try { c.sock.destroy(); } catch (e) {}
    clients.delete(c.id); dirty.delete(c);
    if (c.key && byName.get(c.key) === c) byName.delete(c.key);
    if (c.joined) broadcast({ t: 'l', id: c.id });
  }

  // ---------- helpers ----------
  const num = (v, lim) => (typeof v === 'number' && isFinite(v) && Math.abs(v) <= lim) ? Math.round(v * 100) / 100 : 0;
  function cleanLook(l) {
    const o = {};
    if (l && typeof l === 'object') for (const k of LOOK_KEYS) { const v = l[k]; if (Number.isInteger(v) && v >= 0 && v < 32) o[k] = v; }
    return o;
  }
  function cleanState(s) {
    if (!Array.isArray(s)) return null;
    const car = typeof s[4] === 'string' ? s[4].slice(0, 24) : '';
    return [num(s[0], 1e5), num(s[1], 500), num(s[2], 1e5), num(s[3], 100), car, Number.isInteger(s[5]) && s[5] >= 0 && s[5] <= 0xffffff ? s[5] : 0];
  }
  function guestName() {
    for (let i = 0; i < 50; i++) {
      const n = 'Guest' + (1000 + Math.floor(Math.random() * 9000));
      if (!byName.has(n.toLowerCase())) return n;
    }
    return 'Guest' + Date.now() % 100000;
  }
  const pub = c => ({ id: c.id, name: c.name, look: c.look, s: c.s });

  // ---------- message handling ----------
  function onMsg(c, text) {
    let m; try { m = JSON.parse(text); } catch (e) { return; }
    if (!m || typeof m.t !== 'string') return;

    // simple flood limit: 40 messages / second
    const now = Date.now();
    if (now - c.win > 1000) { c.win = now; c.cnt = 0; }
    if (++c.cnt > 40) return;

    if (!c.joined) {
      if (m.t !== 'hi') return;
      let name = null, key = null;
      if (typeof m.name === 'string' && OKN.test(m.name) && typeof m.h === 'string') {
        const r = read(m.name);                       // prove it's really them: same password hash as the save
        if (r && same(m.h, r.h)) { name = r.name; key = r.name.toLowerCase(); }
      }
      const auth = !!name;
      if (!name) { name = guestName(); key = name.toLowerCase(); }
      const old = byName.get(key);
      if (old && old !== c) { send(old, { t: 'kick' }); drop(old, 1000); }   // same account logged in elsewhere
      c.name = name; c.key = key; byName.set(key, c);
      c.look = cleanLook(m.look); c.s = null; c.joined = true;
      send(c, { t: 'w', id: c.id, name, auth, now: Date.now(), players: [...clients.values()].filter(o => o !== c && o.joined).map(pub) });
      broadcast({ t: 'j', ...pub(c) }, c);
      return;
    }

    if (m.t === 'p') {
      const s = cleanState(m.s); if (!s) return;
      c.s = s; dirty.add(c);
    } else if (m.t === 'look') {
      c.look = cleanLook(m.look);
      broadcast({ t: 'k', id: c.id, look: c.look }, c);
    } else if (m.t === 'b') {                         // casino bets and wins, shown to everyone else
      if (now - (c.lastBet || 0) < 250) return;
      if (typeof m.g !== 'string' || (m.k !== 'b' && m.k !== 'w') || !Number.isFinite(m.a) || m.a <= 0) return;
      c.lastBet = now;
      broadcast({ t: 'b', id: c.id, name: c.name, g: m.g.slice(0, 24), k: m.k, d: typeof m.d === 'string' ? m.d.slice(0, 24) : '', a: Math.min(1e12, m.a) }, c);
    } else if (m.t === 'c') {
      if (typeof m.m !== 'string') return;
      if (now - c.lastChat < 700) return;             // 1 message per 0.7 s
      const msg = m.m.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 120);
      if (!msg) return;
      c.lastChat = now;
      broadcast({ t: 'c', id: c.id, name: c.name, m: msg });   // includes the sender, so they see it too
    }
  }

  function onData(c, chunk) {
    c.buf = c.buf.length ? Buffer.concat([c.buf, chunk]) : chunk;
    while (c.buf.length >= 2) {
      const b0 = c.buf[0], b1 = c.buf[1], fin = !!(b0 & 128), op = b0 & 15, masked = !!(b1 & 128);
      let len = b1 & 127, off = 2;
      if (len === 126) { if (c.buf.length < 4) return; len = c.buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (c.buf.length < 10) return; len = Number(c.buf.readBigUInt64BE(2)); off = 10; }
      if (!masked || len > MAX_FRAME) return drop(c, 1009);   // browsers always mask; reject anything oversized
      if (c.buf.length < off + 4 + len) return;
      const mask = c.buf.subarray(off, off + 4);
      const data = Buffer.from(c.buf.subarray(off + 4, off + 4 + len));
      for (let i = 0; i < len; i++) data[i] ^= mask[i & 3];
      c.buf = c.buf.subarray(off + 4 + len);
      if (op === 8) return drop(c, 1000);
      if (op === 9) { raw(c, frame(10, data)); continue; }
      if (op === 10) { c.alive = true; continue; }
      if (op === 1) c.msg = [data];
      else if (op === 0 && c.msg) c.msg.push(data);
      else continue;
      if (c.msg && c.msg.reduce((a, b) => a + b.length, 0) > MAX_FRAME) return drop(c, 1009);
      if (fin && c.msg) { const t = Buffer.concat(c.msg).toString('utf8'); c.msg = null; onMsg(c, t); if (c.dead) return; }
    }
  }

  // ---------- HTTP upgrade ----------
  server.on('upgrade', (req, sock) => {
    try {
      const u = new URL(req.url, 'http://x');
      const key = req.headers['sec-websocket-key'];
      if (u.pathname !== '/ws' || String(req.headers.upgrade || '').toLowerCase() !== 'websocket' || !key) return sock.destroy();
      // only accept connections coming from our own page (blocks other websites hijacking visitors)
      if (req.headers.origin) {
        let ok = false; try { ok = new URL(req.headers.origin).host === req.headers.host; } catch (e) {}
        if (!ok) { sock.write('HTTP/1.1 403 Forbidden\r\n\r\n'); return sock.destroy(); }
      }
      if (clients.size >= MAX_PLAYERS) { sock.write('HTTP/1.1 503 Service Unavailable\r\n\r\n'); return sock.destroy(); }
      const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
      sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
      sock.setNoDelay(true);
      const c = { id: nextId++, sock, buf: Buffer.alloc(0), joined: false, dead: false, alive: true, win: 0, cnt: 0, lastChat: 0, name: '', key: '', look: {}, s: null, msg: null };
      clients.set(c.id, c);
      sock.on('data', d => onData(c, d));
      sock.on('close', () => drop(c));
      sock.on('error', () => drop(c));
      setTimeout(() => { if (!c.joined) drop(c, 1008); }, 10000);   // must say hello within 10 s
    } catch (e) { try { sock.destroy(); } catch (e2) {} }
  });

  // ---------- broadcast loop: send only the players that moved ----------
  setInterval(() => {
    if (!dirty.size) return;
    const moved = [...dirty].filter(c => c.s && !c.dead);
    dirty.clear();
    if (!moved.length) return;
    const rows = moved.map(c => [c.id, ...c.s]);
    const all = frame(1, Buffer.from(JSON.stringify({ t: 's', p: rows })));
    const ids = new Set(moved.map(c => c.id));
    for (const c of clients.values()) {
      if (!c.joined) continue;
      if (!ids.has(c.id)) raw(c, all);
      else {
        const mine = rows.filter(r => r[0] !== c.id);     // don't echo a player's own position back
        if (mine.length) raw(c, frame(1, Buffer.from(JSON.stringify({ t: 's', p: mine }))));
      }
    }
  }, TICK_MS);

  // ---------- heartbeat: drop dead connections ----------
  setInterval(() => {
    for (const c of clients.values()) {
      if (!c.alive) { drop(c); continue; }
      c.alive = false;
      raw(c, frame(9, Buffer.alloc(0)));   // browsers answer pings automatically
    }
  }, 25000);

  return { online: () => [...clients.values()].filter(c => c.joined).length };
};
