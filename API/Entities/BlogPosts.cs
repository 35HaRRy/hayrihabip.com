using System;
using System.Collections.Generic;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Entities
{
    public class BlogPosts
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string id { get; set; }
        public string title { get; set; }
        public string intro { get; set; }
        public string imageName { get; set; }
        public Infos info { get; set; }
        public List<BlogPostItems> body { get; set; }
        public Navigators navigator { get; set; }
    }

    public class Navigators
    {
        public string previousPostId { get; set; }
        public string nextPostId { get; set; }
    }
}
