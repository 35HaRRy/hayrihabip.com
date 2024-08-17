using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using BLL;

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
        public async Task<IActionResult> PlayList(string id, [FromQuery] int maxLength, [FromQuery] bool isPopular) => File(await YoutubeBLL.GetPlaylistFeedAsync(id, maxLength, isPopular), "application/rss+xml; charset=utf-8");

        [HttpGet("Audio.m4a")]
        public async Task<RedirectResult> GetAudioAsync([FromQuery] string videoId)
        {
            var redirectUrl = await YoutubeBLL.GetAudioAsync(videoId);
            logger.Debug("RedirectUrl: {0}", redirectUrl);
            
            return Redirect(redirectUrl);
        }
    }
}
