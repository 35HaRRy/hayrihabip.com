# Browser acceptance

## Repeat setup

1. Run `npm run build:ssr`.
2. In a second terminal run `node tests/fixture-api.mjs` (API port 5059).
3. Set `API_URL=http://127.0.0.1:5059`, `PORT=3100` in the web terminal and run
   `npm run serve:ssr`. On PowerShell use `$env:API_URL=...; $env:PORT=...`.
4. Open `http://127.0.0.1:3100` using Playwright or Chrome. The alternate web
   port avoids interfering with a developer's existing port-3000 server.

The fixture is isolated test data, not a frontend runtime fallback. Its
`/__state` endpoint exposes request counts; `GET /__mode?mode=error` changes
upstream responses to 503. Reset with `mode=ok` after each error test.

## Checks performed

- [x] With JavaScript disabled, `/blog-post/latest` contains `SSR fixture body`.
- [x] `/blog-list` makes one initial upstream request, with no hydration refetch.
- [x] `devblog_theme=theme-8` restores purple after hydration, without overwrite.
- [x] Next page remains `/blog-list?pageIndex=1&pageSize=25`; reload works.
- [x] Post, previous and next links display the expected title/body.
- [x] Delay the next-post `.data` request, navigate to latest, release the old
  request: the final page remains latest, not the stale next post.
- [x] Delay Twitter's widgets script until both tweet components mount; both
  containers receive widgets.load after the load event. Stub the external
  widgets API at the network boundary and record both calls.
- [x] Stub Disqus embed.js to call disqus_config and implement DISQUS.reset;
  navigate between posts and verify the real post IDs select their threads.
- [x] At 390×844, menu opens/closes with correct aria-expanded; palette changes
  persist; no horizontal document overflow.
- [x] Throw SecurityError from the localStorage getter and block Twitter/Disqus:
  article remains readable, palette works and no pageerror occurs.
- [x] With fixture mode=error, `/index` returns 502 and displays the recoverable
  `İçerik yüklenemedi` state, rather than an empty successful list.
- [x] No pageerrors or hydration errors in browser console. The intentional
  502 error scenario produces an expected browser resource-error message.

Desktop (1440×1000) and mobile (390×844) screenshots were inspected. The
existing layout/fonts/palette were retained. A design detector's font-choice
warning was not acted on: changing the supplied typography is outside scope.

## Boundaries

- Twitter and Disqus live-service availability was not tested; local adapter
  configuration, delayed-script behavior and blocked-script resilience were.
- No real API was listening on 5050/8080 during acceptance. API contract/SSR
  checks used the fixture, not MongoDB. Run against the real API before release.
- Local standard SSR and Vercel-preset builds passed. No live Vercel deploy or
  account changes were performed. Check a deployed deep link and RSS URL.
- VS Code launch/task JSON was checked; an interactive F5 breakpoint session
  with the user's .NET debugger and Chrome still needs user verification.
