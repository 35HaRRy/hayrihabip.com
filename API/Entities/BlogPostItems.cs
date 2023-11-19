using System.Collections.Generic;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Entities
{
    public class BlogPostItems
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string blogPostId { get; set; }
        public string component { get; set; }
        public Dictionary<string, string> attributes { get; set; }
        public dynamic children { get; set; }
        public int sortIndex { get; set; }
    }
}
