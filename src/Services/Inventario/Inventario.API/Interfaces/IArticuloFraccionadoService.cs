namespace Inventario.API.Interfaces;

public interface IArticuloFraccionadoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(ApiRequest data);
    Task<ApiResponse> UpdateAsync(int id, ApiRequest data);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}