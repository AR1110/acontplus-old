namespace Inventario.API.Interfaces;

public interface IArticuloFraccionadoService
{
  Task<object> GetAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}