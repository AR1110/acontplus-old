namespace Restaurant.Core.Interfaces
{
    public interface IMenuService
    {
        public Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
