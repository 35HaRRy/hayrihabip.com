
namespace Entities
{
    public class BlogPosts
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Intro { get; set; }
        public string ImageName { get; set; }
        public Infos Info { get; set; }
    }
}