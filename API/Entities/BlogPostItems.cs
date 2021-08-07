using System.Collections.Generic;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Entities
{
    public class BlogPostItems
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string BlogPostId { get; set; }
        public string Component { get; set; }
        public Dictionary<string, string> Attributes { get; set; }
        public List<object> Children { get; set; }
        public int SortIndex { get; set; }
    }
}
