namespace Contabilidad.API.Interfaces;

public interface ICuentaPorCobrarService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}
