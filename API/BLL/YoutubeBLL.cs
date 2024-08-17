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
using YoutubeExplode;
using Video = Google.Apis.YouTube.v3.Data.Video;
using YouTubeService = Google.Apis.YouTube.v3.YouTubeService;

namespace BLL
{
    public sealed class YoutubeBLL : IYoutubeBLL
    {
        // private readonly NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

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
            _youtubeService =
                new YouTubeService
                (
                    new BaseClientService.Initializer
                    {
                        ApiKey = apiKey,
                        ApplicationName = applicationName
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
                Items = await GenerateItemsAsync(playlist.Snippet.PublishedAtDateTimeOffset.GetValueOrDefault(), arguments)
            };

            Byte[] fileByteArray;
            using (var stream = new MemoryStream())
            {
                var settings = new XmlWriterSettings
                {
                    Encoding = Encoding.UTF8,
                    NewLineHandling = NewLineHandling.Entitize,
                    NewLineOnAttributes = true,
                    Indent = true
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
            // string redirectUri;
            // try
            // {
                var streamManifest = await _youtubeClient.Videos.Streams.GetManifestAsync(videoId);
                var audios = streamManifest
                    .GetAudioOnlyStreams()
                    .ToList();
                var redirectUri = audios.Count > 0
                    ? audios.MaxBy(audio => audio.Bitrate).Url
                    : null;
            // }
            // catch (Exception ex)
            // {
            //     logger.Debug("Getting audio url failed: {0}", ex.Message);

            //     redirectUri = null;
            // }

            return redirectUri;
        }


        private async Task<IEnumerable<SyndicationItem>> GenerateItemsAsync(DateTimeOffset startDate, Arguments arguments)
        {
            IEnumerable<PlaylistItem> playlistItems = (await GetPlaylistItemsAsync(arguments)).ToList();
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
                    new XAttribute("url", $"{_baseUrl}/Audio.m4a?videoId={playlistItem.Snippet.ResourceId.VideoId}")
                ).CreateReader()
            );

            return item;
        }

        private async Task<IEnumerable<SyndicationItem>> SortByPopularityAsync(
            IEnumerable<SyndicationItem> userVideos,
            IEnumerable<PlaylistItem> playlistItems,
            DateTimeOffset startDate)
        {
            var videos = await GetVideosAsync(playlistItems.Select(_ => _.Snippet.ResourceId.VideoId).Distinct());
            var videoDictionary = videos.ToDictionary(_ => _.Id, _ => _);
            userVideos = userVideos.
                OrderByDescending(_ => videoDictionary[_.Id].Statistics.ViewCount.GetValueOrDefault()).
                ToList();
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
            (await Task.WhenAll(MoreLinq.MoreEnumerable.Batch(videoIds, 50).Select(GetVideoBatchAsync))).SelectMany(_ => _);

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