using System.Threading.Tasks;

namespace BLL
{
    public interface IYoutubeBLL
    {
        Task<byte[]> GetPlaylistFeedAsync(
            string playlistId,
            int maxLength,
            bool isPopular);

        Task<string> GetAudioAsync(string videoId);
    }
}