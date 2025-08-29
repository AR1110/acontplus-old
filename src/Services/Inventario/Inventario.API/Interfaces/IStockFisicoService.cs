namespace Inventario.API.Interfaces;

public interface IStockFisicoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, ApiRequest data);
}