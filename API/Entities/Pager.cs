using System.Collections.Generic;

namespace Entities
{
    public class Pager<T>
    {
        public long PageSize { get; set; }
        public long PageIndex { get; set; }
        public List<T> Rows { get; set; }
        public long ShowingFirstRowIndex { get; set; }
        public long ShowingLastRowIndex { get; set; }
        public long TotalPageCount { get; set; }
        public long TotalRecord { get; set; }
        public long ViewingRecord { get; set; }
    }
}
