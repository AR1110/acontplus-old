namespace Restaurant.Core.Interfaces
{
    public interface IOrderService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
    }
}