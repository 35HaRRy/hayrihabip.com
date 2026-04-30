using System;
using System.Threading.Tasks;
using BLL;
using Entities;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

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
        public async Task<ActionResult<Pager<BlogPosts>>> GetPageAsync(
            [FromQuery] int pageSize,
            [FromQuery] int pageIndex
        )
        {
            // validate paging inputs to avoid passing non-positive limits to MongoDB
            if (pageSize <= 0)
                pageSize = 10;
            if (pageIndex < 0)
                pageIndex = 0;

            var allRows = blogPostBLL.GetList();
            var rows = await allRows.Skip(pageIndex * pageSize).Limit(pageSize).ToListAsync();

            foreach (var row in rows)
                row.info.publishDate = BlogPostBLL.GetRelativeTimeText(row.info.regDate);

            var totalRowCount = await allRows.CountDocumentsAsync();

            var showingFirst = pageIndex * pageSize + 1;
            var showingLast = pageIndex * pageSize + rows.Count;
            if (totalRowCount == 0)
            {
                showingFirst = 0;
                showingLast = 0;
            }

            var totalPageCount = (long)Math.Ceiling(totalRowCount / (decimal)pageSize);

            return Ok(
                new Pager<BlogPosts>()
                {
                    PageSize = pageSize,
                    PageIndex = pageIndex,
                    ShowingFirstRowIndex = showingFirst,
                    ShowingLastRowIndex = showingLast,
                    TotalPageCount = totalPageCount,
                    TotalRecord = totalRowCount,
                    ViewingRecord = rows.Count,
                    Rows = rows,
                }
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<APIResult<BlogPosts>>> GetById(string id)
        {
            var post = await blogPostBLL.GetById(id);

            if (post != null)
            {
                return Ok(new APIResult<BlogPosts>() { MessageType = 1, Result = post });
            }
            else
            {
                return NotFound(new APIResult<BlogPosts>() { MessageType = 0 });
            }
        }

        [ResponseCache(Duration = 1200)]
        [HttpGet("feed")]
        public IActionResult Feed() => File(blogPostBLL.GetFeed(), "text/xml; charset=utf-8");
    }
}
