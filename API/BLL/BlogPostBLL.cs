using System;

using Microsoft.Extensions.Configuration;

using MongoDB.Bson;
using MongoDB.Driver;

using Entities;

namespace BLL
{
    public class BlogPostBLL
    {
        public IMongoDatabase ConnectToDB(IConfiguration configuration)
        {   
            var settings = MongoClientSettings.FromConnectionString(configuration.GetConnectionString("ConnectionString"));
            
            var client = new MongoClient(settings);
            return client.GetDatabase("DB");
        }

        public BlogPosts GetById(IConfiguration configuration, string id)
        {
            var DB = ConnectToDB(configuration);

            var postFilter = id == "latest" ? FilterDefinition<BlogPosts>.Empty : Builders<BlogPosts>.Filter.Eq("id", new ObjectId(id));
            var sorter = Builders<BlogPosts>.Sort.Descending(post => post.info.regDate); 

            var post = DB
                .GetCollection<BlogPosts>("post")
                .Find<BlogPosts>(postFilter)
                .Sort(sorter)
                .FirstOrDefault();

            if (post != null)
            {
                post.info.publishDate = GetRelativeTimeText(post.info.regDate);

                var bodyFilter = Builders<BlogPostItems>.Filter.Eq("blogPostId", new ObjectId(post.id));
                var bodySorter = Builders<BlogPostItems>.Sort.Ascending(post => post.sortIndex);

                post.body = DB
                    .GetCollection<BlogPostItems>("bodyItems")
                    .Find<BlogPostItems>(bodyFilter)
                    .Sort(bodySorter)
                    .ToList();
            }

            return post;
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
