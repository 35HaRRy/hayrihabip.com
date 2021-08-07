using Entities;
using Microsoft.Extensions.Configuration;

using MongoDB.Driver;

namespace BLL
{
    public class BlogPostBLL
    {
        public IMongoDatabase ConnectToDB(IConfiguration configuration)
        {   
            var settings = MongoClientSettings.FromConnectionString(configuration.GetConnectionString("ConnectionString"));
            
            var client = new MongoClient(settings);
            return client.GetDatabase("hayrihabip-blog-db");
        }

        public BlogPosts GetById(IConfiguration configuration, string id)
        {
            var DB = ConnectToDB(configuration);

            var postFilter = Builders<BlogPosts>.Filter.Eq("Id", id);
            var bodyFilter = Builders<BlogPostItems>.Filter.Eq("BlogPostId", id);

            var post = DB
                .GetCollection<BlogPosts>("post")
                .Find<BlogPosts>(postFilter)
                .FirstOrDefault();

            if (post != null)
            {
                var sorter = Builders<BlogPostItems>.Sort.Ascending(post => post.SortIndex);

                post.Body = DB
                    .GetCollection<BlogPostItems>("bodyItems")
                    .Find<BlogPostItems>(bodyFilter)
                    .Sort(sorter)
                    .ToList();
            }

            return post;
        }
    }
}
