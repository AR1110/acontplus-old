namespace FactElect.Application.Interfaces.Logistica;

public interface IVehiculoService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> SearchAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
