# Streamkist

Twitch stream notifications for game communities on Discord.

[Website](https://streamkist.zeepki.st/) · [Invite bot](https://discord.com/oauth2/authorize?client_id=1324441059983495240)

## Development

Requires **Bun 1.4.2**. Dependencies follow a three-day minimum release age.

```sh
bun install --frozen-lockfile
bun run dev
```

Edit homepage sections in `app/components/` and commands, pricing, and demo fixtures in `shared/content.ts`.

## Checks

```sh
bun run typecheck
bun run test
bun run lint
bunx biome format .
bunx prettier --check "app/**/*.vue"
bun run build
bunx playwright install chromium
bun run test:browser
```

To use installed Chrome, set `PLAYWRIGHT_CHANNEL=chrome`.

After dependency changes, run `bun dedupe` and `bun dedupe --check`.

## Static deployment

```sh
bun run build
bun run preview
```

Build output: **`.output/public`**, including prerendered HTML, assets, `404.html`, and a SHA-256 release manifest. Serve the entire directory with a static web server. Unknown paths must return `404.html` with HTTP status 404.

Development runs at `http://localhost:5000`; preview uses `http://127.0.0.1:5000`. Override preview port with `PORT`. With preview running, check HTTP output in another terminal:

```sh
bun run check:http http://127.0.0.1:5000
```

CI validates pull requests, `main`, and manual runs. Successful builds upload `streamkist-static.tar.gz`; only `main` publishes:

```text
ghcr.io/zeepkist/streamkist/static:latest
ghcr.io/zeepkist/streamkist/static:sha-<commit>
```

Container images hold static files at `/site`. Docker target `production` builds from source; `artifact` packages an existing build. Extract files for hosting; images have no application runtime.

Regenerate the social preview with `bun run render:social`. Requires Playwright and access to the DINish font CDN.
