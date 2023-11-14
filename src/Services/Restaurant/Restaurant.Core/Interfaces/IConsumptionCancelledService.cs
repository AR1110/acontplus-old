namespace Restaurant.Core.Interfaces
{
    public interface IConsumptionCancelledService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<string> DeleteAsync(Dictionary<string, object> parameters);
    }
}
