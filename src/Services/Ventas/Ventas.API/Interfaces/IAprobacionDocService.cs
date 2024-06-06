namespace Ventas.API.Interfaces;

public interface IAprobacionDocService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<object> GetByIdAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> ConvertToDocAsync(Dictionary<string, object> parameters);
}
