using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel.Syndication;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using Google.Apis.Services;
using Google.Apis.YouTube.v3.Data;
using Microsoft.Extensions.Configuration;
using NLog;
using YoutubeExplode;
using YoutubeDLSharp;
using YoutubeDLSharp.Metadata;
using YoutubeDLSharp.Options;
using Video = Google.Apis.YouTube.v3.Data.Video;
using YouTubeService = Google.Apis.YouTube.v3.YouTubeService;

namespace BLL
{
    public sealed class YoutubeBLL : IYoutubeBLL
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();

        private const string _videoUrlFormat = "http://www.youtube.com/watch?v={0}";
        private const string _playlistUrlFormat = "http://www.youtube.com/playlist?list={0}";

        private readonly IConfiguration _configuration;
        private readonly YoutubeClient _youtubeClient;
        private readonly YouTubeService _youtubeService;

        private readonly string _baseUrl;

        public YoutubeBLL(IConfiguration configuration, string applicationName, string apiKey)
        {
            _configuration = configuration;

            _youtubeClient = new YoutubeClient();
            _youtubeService = new YouTubeService(
                new BaseClientService.Initializer
                {
                    ApiKey = apiKey,
                    ApplicationName = applicationName,
                }
            );

            _baseUrl = _configuration.GetValue<string>("BaseUrl") + "/podcasts";
        }

        public async Task<byte[]> GetPlaylistFeedAsync(
            string playlistId,
            int maxLength,
            bool isPopular
        )
        {
            var arguments = new Arguments(playlistId, maxLength, isPopular);

            var playlistRequest = _youtubeService.Playlists.List("snippet");
            playlistRequest.Id = playlistId;
            playlistRequest.MaxResults = 1;

            var playlist = (await playlistRequest.ExecuteAsync()).Items.First();

            var feed = new ItunesFeed(
                GetTitle(playlist.Snippet.Title, arguments),
                playlist.Snippet.Description,
                new Uri(string.Format(_playlistUrlFormat, playlist.Id))
            )
            {
                ImageUrl = new Uri(playlist.Snippet.Thumbnails.Medium.Url),
                Items = await GenerateItemsAsync(
                    playlist.Snippet.PublishedAtDateTimeOffset.GetValueOrDefault(),
                    arguments
                ),
            };

            Byte[] fileByteArray;
            using (var stream = new MemoryStream())
            {
                var settings = new XmlWriterSettings
                {
                    Encoding = Encoding.UTF8,
                    NewLineHandling = NewLineHandling.Entitize,
                    NewLineOnAttributes = true,
                    Indent = true,
                };

                using (var xmlWriter = XmlWriter.Create(stream, settings))
                {
                    var rssFormatter = new Rss20FeedFormatter(feed, false);
                    rssFormatter.WriteTo(xmlWriter);

                    xmlWriter.Flush();
                }

                fileByteArray = stream.ToArray();
            }

            return fileByteArray;
        }

        public async Task<string> GetAudioAsync(string videoId)
        {
            string redirectUri;
            try
            {
                var streamManifest = await _youtubeClient.Videos.Streams.GetManifestAsync(videoId);
                var audios = streamManifest.GetAudioOnlyStreams().ToList();
                redirectUri = audios.Count > 0 ? audios.MaxBy(audio => audio.Bitrate).Url : null;
            }
            catch (Exception ex)
            {
                logger.Error("Getting audio url failed: {0}", ex.Message);
                redirectUri = null;
            }

            return redirectUri;
        }

        public async Task<YoutubeDownloadResult> GetAudioAsyncByDL(string videoId)
        {
            if (string.IsNullOrWhiteSpace(videoId))
            {
                throw new ArgumentException("Video id cannot be empty.", nameof(videoId));
            }

            var videoUrl = string.Format(_videoUrlFormat, videoId);
            var youtubeDL = await CreateYoutubeDLAsync(videoId);

            try
            {
                var videoDataResult = await youtubeDL.RunVideoDataFetch(videoUrl);
                videoDataResult.EnsureSuccess();

                var redirectUrl = GetBestMp4Url(videoDataResult.Data);
                if (!string.IsNullOrWhiteSpace(redirectUrl))
                {
                    return YoutubeDownloadResult.FromRedirectUrl(redirectUrl);
                }

                var downloadResult = await youtubeDL.RunVideoDownload(
                    videoUrl,
                    format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
                    mergeFormat: DownloadMergeFormat.Mp4,
                    recodeFormat: VideoRecodeFormat.Mp4
                );
                downloadResult.EnsureSuccess();

                return YoutubeDownloadResult.FromFile(downloadResult.Data);
            }
            catch (Exception ex)
            {
                logger.Error("Getting video by youtube-dl failed: {0}", ex.Message);
                throw;
            }
        }

        private static async Task<YoutubeDL> CreateYoutubeDLAsync(string videoId)
        {
            var binariesFolder = Path.Combine(Path.GetTempPath(), "hayrihabip-ytdlp-bin");
            var outputFolder = Path.Combine(
                Path.GetTempPath(),
                "hayrihabip-ytdlp-downloads",
                $"{videoId}-{Guid.NewGuid():N}"
            );

            Directory.CreateDirectory(binariesFolder);
            Directory.CreateDirectory(outputFolder);

            await Utils.DownloadBinaries(directoryPath: binariesFolder);

            return new YoutubeDL
            {
                YoutubeDLPath = Path.Combine(binariesFolder, Utils.YtDlpBinaryName),
                FFmpegPath = Path.Combine(binariesFolder, Utils.FfmpegBinaryName),
                OutputFolder = outputFolder,
                OutputFileTemplate = "%(id)s.%(ext)s",
                RestrictFilenames = true,
                OverwriteFiles = true,
                IgnoreDownloadErrors = false,
            };
        }

        private static string GetBestMp4Url(VideoData videoData)
        {
            var directVideoUrl = videoData?.Formats?
                .Where(format =>
                    string.Equals(format.Extension, "mp4", StringComparison.OrdinalIgnoreCase)
                    && !string.IsNullOrWhiteSpace(format.Url)
                    && !string.Equals(format.VideoCodec, "none", StringComparison.OrdinalIgnoreCase)
                    && !string.Equals(format.AudioCodec, "none", StringComparison.OrdinalIgnoreCase)
                )
                .OrderByDescending(format => format.Height.GetValueOrDefault())
                .ThenByDescending(format => format.Bitrate.GetValueOrDefault())
                .Select(format => format.Url)
                .FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(directVideoUrl))
            {
                return directVideoUrl;
            }

            return string.Equals(videoData?.Extension, "mp4", StringComparison.OrdinalIgnoreCase)
                ? videoData.Url
                : null;
        }

        private async Task<IEnumerable<SyndicationItem>> GenerateItemsAsync(
            DateTimeOffset startDate,
            Arguments arguments
        )
        {
            IEnumerable<PlaylistItem> playlistItems = (
                await GetPlaylistItemsAsync(arguments)
            ).ToList();
            var userVideos = playlistItems.Select(_ => GenerateItem(_));
            if (arguments.IsPopular)
            {
                userVideos = await SortByPopularityAsync(userVideos, playlistItems, startDate);
            }

            return userVideos;
        }

        private async Task<IEnumerable<PlaylistItem>> GetPlaylistItemsAsync(Arguments arguments)
        {
            var playlistItems = new List<PlaylistItem>();
            var nextPageToken = string.Empty;
            while (nextPageToken != null && playlistItems.Count < arguments.MaxLength)
            {
                var playlistItemsListRequest = _youtubeService.PlaylistItems.List("snippet");
                playlistItemsListRequest.PlaylistId = arguments.PlaylistId;
                playlistItemsListRequest.MaxResults = 50;
                playlistItemsListRequest.PageToken = nextPageToken;
                playlistItemsListRequest.Fields = "items(id,snippet),nextPageToken";

                var playlistItemsListResponse = await playlistItemsListRequest.ExecuteAsync();
                playlistItems.AddRange(playlistItemsListResponse.Items);
                nextPageToken = playlistItemsListResponse.NextPageToken;
            }

            return playlistItems.Take(arguments.MaxLength);
        }

        private SyndicationItem GenerateItem(PlaylistItem playlistItem)
        {
            var item = new SyndicationItem(
                playlistItem.Snippet.Title,
                string.Empty,
                new Uri(string.Format(_videoUrlFormat, playlistItem.Snippet.ResourceId.VideoId))
            )
            {
                Id = playlistItem.Snippet.ResourceId.VideoId,
                PublishDate = playlistItem.Snippet.PublishedAtDateTimeOffset.GetValueOrDefault(),
                Summary = new TextSyndicationContent(playlistItem.Snippet.Description),
            };

            item.ElementExtensions.Add(
                new XElement(
                    "enclosure",
                    new XAttribute("type", "audio/mp4"),
                    new XAttribute(
                        "url",
                        $"{_baseUrl}/Audio.m4a?videoId={playlistItem.Snippet.ResourceId.VideoId}"
                    )
                ).CreateReader()
            );

            return item;
        }

        private async Task<IEnumerable<SyndicationItem>> SortByPopularityAsync(
            IEnumerable<SyndicationItem> userVideos,
            IEnumerable<PlaylistItem> playlistItems,
            DateTimeOffset startDate
        )
        {
            var videos = await GetVideosAsync(
                playlistItems.Select(_ => _.Snippet.ResourceId.VideoId).Distinct()
            );
            var videoDictionary = videos.ToDictionary(_ => _.Id, _ => _);
            userVideos = userVideos
                .OrderByDescending(_ =>
                    videoDictionary[_.Id].Statistics.ViewCount.GetValueOrDefault()
                )
                .ToList();
            var i = 0;
            foreach (var userVideo in userVideos)
            {
                userVideo.PublishDate = startDate.AddDays(i);
                i++;
                userVideo.Title = new TextSyndicationContent($"{i}. {userVideo.Title.Text}");
            }

            return userVideos;
        }

        private async Task<IEnumerable<Video>> GetVideosAsync(IEnumerable<string> videoIds) =>
            (
                await Task.WhenAll(
                    MoreLinq.MoreEnumerable.Batch(videoIds, 50).Select(GetVideoBatchAsync)
                )
            ).SelectMany(_ => _);

        private async Task<IEnumerable<Video>> GetVideoBatchAsync(IEnumerable<string> videoIds)
        {
            var statisticsRequest = _youtubeService.Videos.List("statistics");
            statisticsRequest.Id = string.Join(",", videoIds);
            statisticsRequest.MaxResults = 50;
            statisticsRequest.Fields = "items(id,statistics)";

            return (await statisticsRequest.ExecuteAsync()).Items;
        }

        private static string GetTitle(string title, Arguments arguments) =>
            arguments.IsPopular ? $"{title} (By Popularity)" : title;
    }
}
