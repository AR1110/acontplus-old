namespace Inventario.API.Interfaces;

public interface IStockFisicoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(ApiRequest data);
    Task<ApiResponse> UpdateAsync(int id, ApiRequest data);
}