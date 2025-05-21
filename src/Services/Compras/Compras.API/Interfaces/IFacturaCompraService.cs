namespace Compras.API.Interfaces;

public interface IFacturaCompraService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(ApiRequest request);
    Task<object> GetByIdAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, ApiRequest request);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}