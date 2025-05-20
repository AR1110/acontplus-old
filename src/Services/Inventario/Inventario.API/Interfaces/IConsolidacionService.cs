namespace Inventario.API.Interfaces;

public interface IConsolidacionService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<object> GetIdAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}