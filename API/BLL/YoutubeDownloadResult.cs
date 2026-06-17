using System;

namespace BLL
{
    public sealed class YoutubeDownloadResult
    {
        private YoutubeDownloadResult(string redirectUrl, string filePath)
        {
            RedirectUrl = redirectUrl;
            FilePath = filePath;
        }

        public string RedirectUrl { get; }

        public string FilePath { get; }

        public bool HasRedirectUrl => !string.IsNullOrWhiteSpace(RedirectUrl);

        public bool HasFile => !string.IsNullOrWhiteSpace(FilePath);

        public static YoutubeDownloadResult FromRedirectUrl(string redirectUrl)
        {
            if (string.IsNullOrWhiteSpace(redirectUrl))
            {
                throw new ArgumentException("Redirect URL cannot be empty.", nameof(redirectUrl));
            }

            return new YoutubeDownloadResult(redirectUrl, null);
        }

        public static YoutubeDownloadResult FromFile(string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath))
            {
                throw new ArgumentException("File path cannot be empty.", nameof(filePath));
            }

            return new YoutubeDownloadResult(null, filePath);
        }
    }
}
