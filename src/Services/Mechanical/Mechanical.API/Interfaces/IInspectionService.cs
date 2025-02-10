namespace Mechanical.API.Interfaces
{
    public interface IInspectionService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    }
}
