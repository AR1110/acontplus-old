namespace Compras.API.Interfaces;

public interface IProveedorService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(ApiRequest request);
    Task<ApiResponse> UpdateAsync(int id, ApiRequest request);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}
