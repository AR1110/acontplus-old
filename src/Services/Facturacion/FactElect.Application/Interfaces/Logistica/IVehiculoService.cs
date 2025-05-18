namespace FactElect.Application.Interfaces.Logistica;

public interface IVehiculoService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}