namespace Restaurant.API.Interfaces
{
    public interface IConsumptionService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> PrintAsync(Dictionary<string, object> parameters);
    }
}
