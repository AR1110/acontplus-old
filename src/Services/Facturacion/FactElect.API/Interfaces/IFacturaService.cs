namespace FactElect.API.Interfaces
{
    public interface IFacturaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetByIdAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    }
}
