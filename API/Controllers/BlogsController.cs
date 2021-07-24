using System;
using System.Collections.Generic;
using System.IO;
using System.ServiceModel.Syndication;
using System.Text;
using System.Xml;

using Microsoft.AspNetCore.Mvc;

using Entities;
using System.Xml.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        List<BlogPosts> Posts = new List<BlogPosts>()
        {
            new BlogPosts()
            {
                Id = 1,
                ImageName = "blog-post-thumb-1.jpg",
                Info = new Infos()
                {
                    CommentCount = 0,
                    PublishDate = DateTime.Now,
                    ReadMin = "5 mins"
                },
                Intro = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies...",
                Title = "Why Every Developer Should Have A Blog",
            }
        };
        
        string baseClientPath = "https://blog.hayrihabip.com/";

        [HttpGet]
        public ActionResult<Pager<BlogPosts>> GetPage([FromQuery] int pageSize, [FromQuery] int pageIndex)
        {
            return Ok(new Pager<BlogPosts>()
            {
                PageSize = 25,
                PageIndex = 0,
                ShowingFirstRowIndex = 0,
                ShowingLastRowIndex = 0,
                TotalPageCount = 1,
                TotalRecord = 0,
                ViewingRecord = 0,
                Rows = Posts
            });
        }

        // GET api/Blogs/5
        [HttpGet("{id}")]
        public ActionResult<APIResult<BlogPosts>> GetById(int id)
        {
            var post = Posts.Find(post => post.Id == id);
            if (post != null)
                return Ok(new APIResult<BlogPosts>()
                {
                    MessageType = 1,
                    Result = post
                });
            else
                return NotFound(new APIResult<BlogPosts>()
                {
                    MessageType = 0
                });
        }

        [ResponseCache(Duration = 1200)]
        [HttpGet("feed")]
        public IActionResult Feed()
        {
            var person = new SyndicationPerson("hayrihabip@hotmail.com", "Hayri HABİP", "https://hayrihabip.com/");

            var feed = new SyndicationFeed(
                "Hayri HABİP, çizikli küçük kutucuklar peşinde...", 
                "Yazılımın her aşamasına meraklıyım. Herhangi bir soruna yazılımlar ile çözüm bulmaktan keyif alıyorum.", 
                new Uri("https://api.hayrihabip.com/feed"), "35HH", DateTime.Now
            );
            feed.Authors.Add(person);
            feed.ImageUrl = new Uri(baseClientPath + "assets/images/profile.png");
            feed.Copyright = new TextSyndicationContent($"{DateTime.Now.Year} Hayri HABİP");

            var items = new List<SyndicationItem>();
            var posts = Posts;

            foreach (var post in posts)
            {
                var postUrl = new Uri($"{baseClientPath}blog-post/{post.Id}");
                var item = new SyndicationItem(post.Title, post.Intro, postUrl, post.Id.ToString(), post.Info.PublishDate);
                
                item.Authors.Add(person);
                item.ElementExtensions.Add(new XElement("image", $"{baseClientPath}/assets/images/blog/{post.ImageName}"));

                items.Add(item);
            }

            feed.Items = items;
      
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

                return File(stream.ToArray(), "text/xml; charset=utf-8");
            }
        }
    }
}
