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
    }
}
