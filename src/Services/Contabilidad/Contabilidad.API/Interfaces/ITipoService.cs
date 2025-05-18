namespace Contabilidad.API.Interfaces;

public interface ITipoService
{
    Task<ApiResponse> AddAsync(Tipo tipo);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, Tipo tipo);
}