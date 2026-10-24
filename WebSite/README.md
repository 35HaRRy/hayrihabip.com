# Hayri Habip — React website

React 19 + React Router 7 framework mode, request-time SSR, Vite and Tailwind.
The v2 design keeps the previous site's blog URLs and API contract.
`v1-archive/` is reference only; do not install or build it for this application.

## Requirements and setup

- Node.js **22.22+**, preferably **24 LTS**, and npm.
- Use `package-lock.json` and `npm ci`; no Bun/pnpm/Yarn setup is needed.

```sh
npm ci
```

Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`).
Set the server-only API root:

```dotenv
API_URL=http://localhost:5050
```

VS Code API debug uses `5050`. Docker Compose uses `http://localhost:8080`.
The API must have its own MongoDB/backend configuration. Never copy backend
database or Notion credentials into this frontend project or a `VITE_*` variable.
Vite reads `.env` in development; the production serve command reads it through Node.
Existing process environment variables take precedence over `.env`.

## Develop and debug

```sh
npm run dev:ssr
```

Open `http://127.0.0.1:4000`. SSR and browser requests use the same `API_URL`.
`/api/BlogPosts` proxies to the API's `/BlogPosts`; query strings and response
status/body are preserved. Server loaders use that same API root directly.

From the repository-root VS Code workspace, press F5 and select:

- **WebSite: SSR Debug** — server breakpoints, browser debugger opens when ready.
- **WebSite: Browser Debug** — attach a new browser to an already running site.
- **WebSite + API: Debug** — existing .NET API debug plus SSR/browser debug.

The .NET debugger and Chrome must be installed for their respective launch modes.
The existing API debug environment file remains unchanged. Frontend build and
typecheck are also available under VS Code Tasks.

## Production and checks

```sh
npm test
npm run typecheck
npm run build:ssr
npm run test:ssr
npm run serve:ssr
```

`dev`/`dev:ssr` and `build`/`build:ssr` are aliases for the same SSR application.
`serve:ssr` runs `build/server/index.js` on port `3000`; set `PORT` to override.
Build does not contact the API or prerender a static copy of posts.
The HTTP smoke tests start an isolated fixture API and production server;
they do not touch your database or require the real API.
Browser acceptance steps are in [tests/browser-checklist.md](tests/browser-checklist.md).

Routes: `/` → `/index`, `/index`, `/blog-list`, `/blog-post` →
`/blog-post/latest`, `/blog-post/:id`, `/about`. List query defaults:
`pageIndex=0&pageSize=25`. Invalid post IDs return 404. API failures show an
error state rather than fake posts or an empty successful list.

## Vercel

- Root Directory: **WebSite**.
- Framework Preset: **React Router**.
- Install Command: **npm ci**.
- Build Command: **npm run build**.
- Node.js: **24.x** (or supported 22.x satisfying the package engine).
- Leave Output Directory at the framework default; do not set it to `dist`.
- Set server environment variable **API_URL=https://api.hayrihabip.com**
  for Production and Preview, or use the appropriate private preview API.
- Do not add a catch-all SPA rewrite or a separate hard-coded `/api` rewrite.

`@vercel/react-router`'s supported preset is enabled by Vercel's `VERCEL`
environment variable. Local builds use a standard Node server output; Vercel
builds use the platform server bundles. `/api/*` is a server resource route
using the same environment variable in both environments.

After deployment, open a deep article URL directly, inspect its initial HTML
for the article content, and check `/api/BlogPosts/feed` returns XML.
Deploying or changing Vercel account/project settings is a separate manual step.

## Content and client-only features

Published data comes only from the API. Historical JSON files under `src/data/`
are not a runtime fallback. Existing post IDs keep their Disqus threads
(`hayrihabip` shortname). Tweets and comments initialize after hydration;
blocking their third-party scripts does not prevent reading the article.
The saved color theme is restored after hydration, including when storage
access is unavailable. Existing image and public verification URLs are retained.
