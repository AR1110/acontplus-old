namespace Contabilidad.Domain.Repositories;

public interface IComprobanteIngresoRepository
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> CancelAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}