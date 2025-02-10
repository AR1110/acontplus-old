namespace Mechanical.API.Interfaces
{
    public interface IVehicleService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(int id);
        Task<ApiResponse> UpdateStateAsync(int id, bool state);
    }
}
