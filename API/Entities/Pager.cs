using System.Collections.Generic;

namespace Entities
{
    public class Pager<T>
    {
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public List<T> Rows { get; set; }
        public int ShowingFirstRowIndex { get; set; }
        public int ShowingLastRowIndex { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
        public int ViewingRecord { get; set; }
    }
}
