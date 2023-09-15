namespace Restaurant.Core.Interfaces
{
    public interface IMenuItemService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetIdAsync(Dictionary<string, object> parameters);
    }
}
