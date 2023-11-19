using Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel.Syndication;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace BLL
{
    public interface IBlogPostBLL
    {
        IMongoDatabase ConnectToDB();

        IFindFluent<BlogPosts, BlogPosts> GetList();
        Task<BlogPosts> GetById(string id);
        byte[] GetFeed();
    }

    public class BlogPostBLL : IBlogPostBLL
    {
        private string baseClientPath = "https://blog.hayrihabip.com/";

        readonly IConfiguration configuration;
        readonly IMongoDatabase Database;

        public BlogPostBLL(IConfiguration _configuration)
        {
            configuration = _configuration;
            Database = ConnectToDB();
        }

        public IMongoDatabase ConnectToDB() => new MongoClient(configuration.GetConnectionString("ConnectionString"))
            .GetDatabase("DB");

        public IFindFluent<BlogPosts, BlogPosts> GetList()
        {
            var sorter = Builders<BlogPosts>.Sort.Descending(post => post.info.regDate);

            return Database
                .GetCollection<BlogPosts>("post")
                .Find(FilterDefinition<BlogPosts>.Empty)
                .Sort(sorter);
        }

        public async Task<BlogPosts> GetById(string id)
        {
            var postFilter = id == "latest" ? FilterDefinition<BlogPosts>.Empty : Builders<BlogPosts>.Filter.Eq("id", new ObjectId(id));
            var sorter = Builders<BlogPosts>.Sort.Descending(post => post.info.regDate);

            var post = Database
                .GetCollection<BlogPosts>("post")
                .Find(postFilter)
                .Sort(sorter)
                .FirstOrDefault();

            if (post != null)
            {
                post.info.publishDate = GetRelativeTimeText(post.info.regDate);

                var bodyFilter = Builders<BsonDocument>.Filter.Eq("blogPostId", new ObjectId(post.id));
                var bodySorter = Builders<BsonDocument>.Sort.Ascending(sortItem => sortItem["sortIndex"].AsInt32);

                var bodyItems = await Database
                    .GetCollection<BsonDocument>("bodyItems")
                    .Find(bodyFilter)
                    .Sort(bodySorter)
                    .ToListAsync();

                post.body = bodyItems.Select(item => item.ToDictionary());
            }

            return post;
        }

        public byte[] GetFeed()
        {
            var person = new SyndicationPerson("hayrihabip@hotmail.com", "Hayri HABİP", "https://hayrihabip.com/");

            var posts = Database
                .GetCollection<BlogPosts>("post")
                .FindSync<BlogPosts>(FilterDefinition<BlogPosts>.Empty)
                .ToList();

            var items = new List<SyndicationItem>();

            foreach (var post in posts)
            {
                var postUrl = new Uri($"{baseClientPath}blog-post/{post.id}");
                var item = new SyndicationItem(post.title, post.intro, postUrl, post.id, post.info.regDate);

                item.Authors.Add(person);
                item.ElementExtensions.Add(new XElement("image", $"{baseClientPath}/assets/images/blog/{post.imageName}"));

                items.Add(item);
            }

            var feed = new SyndicationFeed(
                "Hayri HABİP, çizikli küçük kutucuklar peşinde...",
                "Yazılımın her aşamasına meraklıyım. Herhangi bir soruna yazılımlar ile çözüm bulmaktan keyif alıyorum.",
                new Uri("https://api.hayrihabip.com/feed"), "35HH", posts.OrderBy(post => post.info.regDate).Last().info.regDate
            );
            feed.Authors.Add(person);
            feed.ImageUrl = new Uri(baseClientPath + "assets/images/profile.png");
            feed.Copyright = new TextSyndicationContent($"{DateTime.Now.Year} Hayri HABİP");
            feed.Items = items;

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

        public static string GetRelativeTimeText(DateTime date)
        {
            const int SECOND = 1;
            const int MINUTE = 60 * SECOND;
            const int HOUR = 60 * MINUTE;
            const int DAY = 24 * HOUR;
            const int MONTH = 30 * DAY;

            var ts = new TimeSpan(DateTime.UtcNow.Ticks - date.Ticks);
            double delta = Math.Abs(ts.TotalSeconds);

            if (delta < 1 * MINUTE)
                return ts.Seconds == 1 ? "one second ago" : ts.Seconds + " seconds ago";

            if (delta < 2 * MINUTE)
                return "a minute ago";

            if (delta < 45 * MINUTE)
                return ts.Minutes + " minutes ago";

            if (delta < 90 * MINUTE)
                return "an hour ago";

            if (delta < 24 * HOUR)
                return ts.Hours + " hours ago";

            if (delta < 48 * HOUR)
                return "yesterday";

            if (delta < 30 * DAY)
                return ts.Days + " days ago";

            if (delta < 12 * MONTH)
            {
                int months = Convert.ToInt32(Math.Floor((double)ts.Days / 30));
                return months <= 1 ? "one month ago" : months + " months ago";
            }
            else
            {
                int years = Convert.ToInt32(Math.Floor((double)ts.Days / 365));
                return years <= 1 ? "one year ago" : years + " years ago";
            }
        }
    }
}
