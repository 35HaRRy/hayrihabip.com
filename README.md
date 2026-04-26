# hayrihabip.com

## Overview
A personal monorepo for my website and related tooling.
It contains three separate parts: the main Angular-based website, a .NET 8 API, and Python utilities for AI and bookmark workflows.

## Repository Structure
- `WebSite/`: Angular 12 application with SSR support
- `API/`: ASP.NET Core backend for content and media-related endpoints
- `AI/`: FastAPI-based Python utilities for bookmarks, RSS, and text-to-speech

## Dependencies
### WebSite
- Node.js and npm
- Angular 12, Angular Universal, Express
- Additional packages such as Font Awesome, RxJS, ngx-disqus, ngx-highlightjs, and ngx-tweet

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
2. Restore frontend packages with `cd WebSite && npm install`.
3. Restore the API with `dotnet restore API/API.csproj`.
4. Install Python dependencies with `cd AI && poetry install`.
5. Configure environment-specific settings in the relevant `.env` or `appsettings` files.

## Run
- Website: `cd WebSite && npm run dev:ssr`
- API: `dotnet run --project API/API.csproj`
- AI services: `cd AI && uvicorn main:app --reload`

## Notes
This repository is organized as a small multi-service workspace, so each subproject can be developed independently.