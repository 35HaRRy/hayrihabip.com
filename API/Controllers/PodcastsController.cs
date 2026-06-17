using System;
using System.IO;
using System.Threading.Tasks;
using BLL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PodcastsController : ControllerBase
    {
        private readonly NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        private readonly IYoutubeBLL YoutubeBLL;

        public PodcastsController(IYoutubeBLL _YoutubeBLL)
        {
            YoutubeBLL = _YoutubeBLL;
        }

        [ResponseCache(Duration = 1200)]
        [HttpGet("playList/{id}")]
        public async Task<IActionResult> PlayList(
            string id,
            [FromQuery] int maxLength,
            [FromQuery] bool isPopular
        ) =>
            File(
                await YoutubeBLL.GetPlaylistFeedAsync(id, maxLength, isPopular),
                "application/rss+xml; charset=utf-8"
            );

        [HttpGet("Audio.m4a")]
        public async Task<IActionResult> GetAudioAsync([FromQuery] string videoId)
        {
            // var redirectUrl = await YoutubeBLL.GetAudioAsync(videoId);
            // logger.Debug("RedirectUrl: {0}", redirectUrl);

            // return Redirect(redirectUrl);
            var result = await YoutubeBLL.GetAudioAsyncByDL(videoId);

            if (result.HasRedirectUrl)
            {
                logger.Debug("YoutubeDL RedirectUrl: {0}", result.RedirectUrl);
                return Redirect(result.RedirectUrl);
            }

            if (!result.HasFile || !System.IO.File.Exists(result.FilePath))
            {
                return NotFound();
            }

            Response.OnCompleted(() =>
            {
                DeleteDownloadedFile(result.FilePath);
                return Task.CompletedTask;
            });

            var fileStream = new FileStream(
                result.FilePath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read,
                64 * 1024,
                FileOptions.Asynchronous | FileOptions.SequentialScan
            );

            return File(fileStream, "video/mp4", enableRangeProcessing: true);
        }

        private void DeleteDownloadedFile(string filePath)
        {
            try
            {
                System.IO.File.Delete(filePath);

                var directory = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrWhiteSpace(directory) && Directory.Exists(directory))
                {
                    Directory.Delete(directory, recursive: true);
                }
            }
            catch (Exception ex)
            {
                logger.Warn("Deleting downloaded youtube-dl file failed: {0}", ex.Message);
            }
        }
    }
}
