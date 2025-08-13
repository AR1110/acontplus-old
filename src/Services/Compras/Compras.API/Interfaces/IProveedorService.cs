namespace Compras.API.Interfaces;

public interface IProveedorService
{
  Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}