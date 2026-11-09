# Empire City

A shared open city in your browser. Drive, gamble, trade and collect with your friends, on any phone or computer.

## Deploy: GitHub to Railway

1. Make a new GitHub repo and upload everything in this folder (keep the `public/` folder).
2. On railway.com: **New Project, Deploy from GitHub repo**, then pick the repo.
3. **Add a Volume** (service, Settings, Volumes). Mount path: `/data`.
   Without it Railway wipes the disk on every deploy and all player saves are lost.
4. Service, **Variables**:
   - `DATA_DIR` = `/data`
   - `ADMIN_USERS` = `matt6769` (comma separated for more admins)
5. Service, **Settings, Networking, Generate Domain**. Open the link and play.

Pushing to GitHub redeploys automatically. Saves live on the volume, so updates never touch them.
Players get the new version on their next load.

**Tip for phones:** open the link in Safari or Chrome and use *Add to Home Screen*. It installs as an app with no browser bars.

## What is where

| File | What it does |
| --- | --- |
| `server.js` | Accounts, saves, static files with compression. No packages needed. |
| `multiplayer.js` | WebSocket relay for positions and chat. |
| `public/index.html` | The page and its layout. |
| `public/css/empire.css` | All visual styling. Colors are the variables at the top. |
| `public/js/boot.js` | Loading screen, loads the 3D engine with backup sources. |
| `public/js/gfx.js` | Sky, water, buildings, batching, film look, quality scaling. |
| `public/js/ui.js` | Every phone screen, map, minimap, speedometer. |
| `public/casino/index.html` | Empire Mobile Casino: blackjack, baccarat, roulette, crypto, stocks and meme coin trading, and VIP. It's the Casino app on the phone. |
| `public/js/game.js` | Game rules: driving, economy, quests, multiplayer client. |

## Empire Mobile Casino

The Casino app on the phone is Empire Mobile Casino. The Neon Palace opens its lobby and the Coin Exchange opens its Trade screen.

- City coins are the balance, so anything won or lost there changes the same coins used for cars and packs.
- Casino progress, stats and open trades save inside the player's Empire City account, with no separate login.
- Wagers and trading fees raise the VIP tier shown on the phone and add level XP.
- It unlocks once the starter quest reaches the first car.
- Players' old crypto holdings were cashed out at what they paid, the first time each save loads.

## Multiplayer

Everyone who opens your Railway link is in the same city at the same time.

- **Chat:** tap the online counter under the minimap, or press Enter on a keyboard. Messages also appear above players' heads.
- **Friends:** open the counter and tap the star next to a player. Friends get a gold name tag and a gold dot on the map.
- **Identity:** logged-in players show their username, verified against the server's password hash. Guests show as `Guest1234`. Logging in on a second device replaces the first session.
- **Cars are solid:** your car bumps other players' cars. Walking players pass through each other.

Settings (optional, Railway Variables): `MAX_PLAYERS` (default 60). Check who is online at `/api/online`.
Run only one instance of the service (the Railway default). Extra replicas would be separate cities.

## Graphics settings

Profile app, Graphics: **Auto** (default) watches the frame rate and adjusts resolution so the game stays smooth. **High**, **Balanced** and **Battery** lock a level.

The day runs 10 real minutes and lingers on sunset and the neon night.

## Moving old progress

Save data is unchanged, so existing accounts keep working. To move between sites: Profile, Copy save code on the old copy, then log in as the same username on the new site and use Paste save code.

## How saving works

- Accounts and saves live on the server in `DATA_DIR/saves/<name>.json` (only a salted password hash, never the password).
- The game autosaves every 8 seconds when something changed, plus on close.
- The server keeps 5 rolling backups per player (one every 10+ minutes).
- The browser keeps a local copy too, and the newest save wins.

## Admin menu

Log in as an account listed in `ADMIN_USERS` and an Admin tab appears in the phone.
This is a play-money game and the game trusts the browser, so don't use it to protect anything real.

## Run locally

`node server.js` then open http://localhost:3000 (Node 18+, no installs needed).
Open two browser windows (one normal, one private) to see multiplayer working.

## Credits

Fonts in `public/fonts`: TeX Gyre Adventor (GUST Font License) and Inter (SIL Open Font License), subset for the web. Icons and logo are original to this project.

## Neon Palace (walk-in casino)

Walk into the Neon Palace in the city to reach 14 games on the floor: Duck Derby, Big Wheel, Moonshot, Lucky Reels, Minefield, Skull Tower, Plinko, Hi-Lo Dial, Keno, Street Dice, Video Poker, Blackjack, Baccarat and Roulette. Rounds of Duck Derby, Big Wheel and Moonshot are worked out from the clock so everyone sees the same result, and friends' bets and wins show up over the server. Code: `public/js/floor-games.js` (maths), `public/js/palace-ui.js` (screens), `public/js/palace.js` (the 3D room).
