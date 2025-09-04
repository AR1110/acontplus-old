namespace Ventas.Application.Interfaces;

public interface IAprobacionDocService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<SpResponse> ConvertToDocAsync(Dictionary<string, object> parameters);
}
