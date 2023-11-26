using System;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using MongoDB.Driver;

using Entities;
using BLL;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BlogPostsController : ControllerBase
    {           
        readonly IBlogPostBLL blogPostBLL;

        public BlogPostsController(IBlogPostBLL _blogPostBLL)
        {
            blogPostBLL = _blogPostBLL;
        }

        [HttpGet]
        public async Task<ActionResult<Pager<BlogPosts>>> GetPageAsync([FromQuery] int pageSize, [FromQuery] int pageIndex)
        {
            var allRows = blogPostBLL.GetList();
            var rows = await allRows
                .Skip(pageIndex * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            foreach (var row in rows)
                row.info.publishDate = BlogPostBLL.GetRelativeTimeText(row.info.regDate);

            var totalRowCount = await allRows.CountDocumentsAsync();

            return Ok(new Pager<BlogPosts>()
            {
                PageSize = pageSize,
                PageIndex = pageIndex,
                ShowingFirstRowIndex = pageIndex * pageSize + 1,
                ShowingLastRowIndex = rows.Count + (pageIndex * pageSize),
                TotalPageCount = (long)Math.Floor(totalRowCount / (decimal)pageSize),
                TotalRecord = totalRowCount,
                ViewingRecord = rows.Count,
                Rows = rows
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<APIResult<BlogPosts>>> GetById(string id)
        {
            var post = await blogPostBLL.GetById(id);

            if (post != null)
            {
                return Ok(new APIResult<BlogPosts>()
                {
                    MessageType = 1,
                    Result = post
                });
            }
            else
            {
                return NotFound(new APIResult<BlogPosts>()
                {
                    MessageType = 0
                });
            }
        }

        [ResponseCache(Duration = 1200)]
        [HttpGet("feed")]
        public IActionResult Feed() => File(blogPostBLL.GetFeed(), "text/xml; charset=utf-8");
    }
}
