namespace FactElect.Application.Interfaces.RetencionAts;

public interface IDocSustentoImpuestoService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
