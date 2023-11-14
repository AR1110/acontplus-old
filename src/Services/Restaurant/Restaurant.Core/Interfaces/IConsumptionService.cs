namespace Restaurant.Core.Interfaces
{
    public interface IConsumptionService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<string> DeleteAsync(Dictionary<string, object> parameters);
        Task<string> PrintAsync(Dictionary<string, object> parameters);
    }
}
