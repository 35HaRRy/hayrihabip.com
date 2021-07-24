
namespace Entities
{
    public class APIResult<T>
    {
        public string Message { get; set; }
        public int MessageType { get; set; }
        public T Result { get; set; }
    }
}
