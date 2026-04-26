# hayrihabip.com

## Summary
A personal website monorepo with an Angular SSR frontend, a .NET 8 API, and Python-based AI/bookmark utilities.

## Dependencies
- Node.js and npm
- Angular 12, Angular Universal, Express, and the packages listed in `WebSite/package.json`
- .NET 8 SDK with packages such as `MongoDB.Driver`, `NLog`, `YoutubeExplode`, and `Google.Apis.YouTube.v3`
- Python 3.12 with Poetry and the packages in `pyproject.toml` (`FastAPI`, `trafilatura`, `edge-tts`)

## Setup
1. Install frontend dependencies: `cd WebSite && npm install`.
2. Restore the API: `dotnet restore API/API.csproj`.
3. Install Python dependencies: `poetry install`.
4. Run the component you need:
   - `npm run dev:ssr` for the website
   - `dotnet run --project API/API.csproj` for the API
   - `python AI/main.py` for the Python tools