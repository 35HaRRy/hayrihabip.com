# hayrihabip.com

## Overview
A personal monorepo for my website and related tooling.
It contains three separate parts: the React website, a .NET API, and Python utilities for AI and bookmark workflows.

## Repository Structure
- `WebSite/`: React 19 + React Router 7 application with request-time SSR
- `WebSite/v1-archive/`: previous Angular application, preserved as reference
- `API/`: ASP.NET Core backend for content and media-related endpoints
- `AI/`: FastAPI-based Python utilities for bookmarks, RSS, and text-to-speech

## Dependencies
### WebSite
- Node.js 22.22+ (24 LTS recommended) and npm
- React 19, React Router 7, Vite, Tailwind, Font Awesome and highlight.js
- See [WebSite setup, debug and Vercel deployment](WebSite/README.md).

### API
- .NET 8 SDK
- `MongoDB.Driver`
- `NLog` and `NLog.Web.AspNetCore`
- `YoutubeExplode`
- `Google.Apis.YouTube.v3`
- `Newtonsoft.Json`

### AI
- Python 3.12
- Poetry
- `fastapi[standard]`
- `trafilatura`
- `edge-tts`

## Setup
1. Install the dependencies for the part you want to work on.
2. Restore frontend packages with `cd WebSite && npm ci`; copy `.env.example` to `.env`.
3. Restore the API with `dotnet restore API/API.csproj`.
4. Install Python dependencies with `cd AI && poetry install`.
5. Configure environment-specific settings in the relevant `.env` or `appsettings` files.

## Run
- Website: `cd WebSite && npm run dev:ssr`
- Website API target: `API_URL` in `WebSite/.env`; defaults to `http://localhost:5050` (VS Code API debug), or `http://localhost:8080` for Compose.
- API: `dotnet run --project API/API.csproj`
- AI services: `cd AI && uvicorn main:app --reload`

### API and MongoDB with Docker Compose
Requires Docker with Compose and Linux containers. From the repository root:

```sh
docker compose -f DevOps/Compose/docker-compose.yml up --build -d
```

The API is available at `http://localhost:8080`. MongoDB is accessible only on
the Compose network, and the API waits for its healthcheck before starting.
MongoDB's `/data/db` is bind-mounted to the repository's `db-data/` directory;
data survives container recreation. This configuration is for local development,
not production: MongoDB authentication is disabled and the API binds to localhost.

Stop the services without deleting database files:

```sh
docker compose -f DevOps/Compose/docker-compose.yml down
```

Validate the Compose configuration and check environment-variable precedence
(the configuration check requires the .NET 8 SDK and runtime):

```sh
docker compose -f DevOps/Compose/docker-compose.yml config --quiet
dotnet run --project DevOps/Compose/tests/ConfigurationCheck.csproj -- API
```

## Notes
This repository is organized as a small multi-service workspace, so each subproject can be developed independently.
