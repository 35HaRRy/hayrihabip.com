using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel.Syndication;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

using Microsoft.AspNetCore.Mvc;

using Microsoft.Extensions.Configuration;

using MongoDB.Driver;

using Entities;
using BLL;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostsController : ControllerBase
    {
        IConfiguration Configuration;
        IMongoDatabase DataBase;
                
        string baseClientPath = "https://blog.hayrihabip.com/";

        public BlogPostsController(IConfiguration configuration)
        {
            Configuration = configuration;

            DataBase = new BlogPostBLL().ConnectToDB(Configuration);
        }

        [HttpGet]
        public async Task<ActionResult<Pager<BlogPosts>>> GetPageAsync([FromQuery] int pageSize, [FromQuery] int pageIndex)
        {
            var sorter = Builders<BlogPosts>.Sort.Descending(post => post.RegDate);

            var allRows = DataBase
                .GetCollection<BlogPosts>("post")
                .Find(FilterDefinition<BlogPosts>.Empty)
                .Sort(sorter);
            var rows = await allRows
                .Skip(pageSize * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            var totalRowCount = await allRows.CountDocumentsAsync();

            return Ok(new Pager<BlogPosts>()
            {
                PageSize = pageSize,
                PageIndex = pageIndex,
                ShowingFirstRowIndex = pageSize * pageSize + 1,
                ShowingLastRowIndex = rows.Count + (pageSize * pageSize) + 1,
                TotalPageCount = (long)Math.Floor(totalRowCount / (decimal)pageSize),
                TotalRecord = totalRowCount,
                ViewingRecord = rows.Count,
                Rows = rows
            });
        }

        // GET api/Blogs/5
        [HttpGet("{id}")]
        public ActionResult<APIResult<BlogPosts>> GetById(string id)
        {
            var post = new BlogPostBLL().GetById(Configuration, id);

            if (post != null)
            {
                return Ok(new APIResult<BlogPosts>()
                {
                    MessageType = 1,
                    Result = post
                });
            }
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

            var posts = DataBase
                .GetCollection<BlogPosts>("post")
                .FindSync<BlogPosts>(FilterDefinition<BlogPosts>.Empty)
                .ToList();                

            var items = new List<SyndicationItem>();

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
