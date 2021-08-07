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
        public string Id { get; set; }
        public string Title { get; set; }
        public string Intro { get; set; }
        public string ImageName { get; set; }
        public Infos Info { get; set; }
        public List<BlogPostItems> Body { get; set; }
        public DateTime RegDate { get; set; }
        public string PreviousPostId { get; set; }
        public string NextPostId { get; set; }
    }
}
