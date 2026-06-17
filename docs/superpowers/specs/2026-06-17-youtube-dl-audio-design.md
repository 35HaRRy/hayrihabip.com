# YoutubeDL Audio Design

## Goal

Add a `GetAudioAsyncByDL` flow that accepts a YouTube video id, prefers returning a direct YouTube mp4 URL, and falls back to downloading an mp4 with YoutubeDLSharp so the API can stream it.

## Architecture

`YoutubeBLL` will expose a small result object for either a redirect URL or a downloaded file path. `PodcastsController` will translate that result into either `Redirect(...)` or a streamed `FileStreamResult`.

The controller owns response cleanup by registering a callback that deletes the temporary file after the response completes.

## Components

- `API/BLL/YoutubeDownloadResult.cs`: result model for URL or local file.
- `API/BLL/IYoutubeBLL.cs`: adds `Task<YoutubeDownloadResult> GetAudioAsyncByDL(string videoId)`.
- `API/BLL/YoutubeBLL.cs`: uses YoutubeDLSharp to fetch metadata formats and download mp4 fallback.
- `API/Controllers/PodcastsController.cs`: adds `GET /Podcasts/AudioByDL.mp4?videoId=...`.
- `API/API.csproj`: adds `YoutubeDLSharp` package reference.

## Error Handling

Invalid or empty video ids throw an argument error. YoutubeDLSharp failures are logged and re-thrown so the API returns a normal server error instead of silently redirecting to a null URL.

## Testing

Build verification is required. If a .NET test project is added later, the pure result model and controller branch behavior should be unit tested without calling YouTube.
