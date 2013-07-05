namespace TextUml.Models
{
    using System.Collections.Generic;
    using System.Linq;

    public class PagedQueryResult<T>
    {
        public PagedQueryResult() : this(Enumerable.Empty<T>(), 0L)
        {
        }

        public PagedQueryResult(IEnumerable<T> data, long count)
        {
            Data = data;
            Count = count;
        }

        public IEnumerable<T> Data { get; private set; }

        public long Count { get; private set; }
    }
}