namespace FactElect.Application.Interfaces.RetencionAts;

public interface IRetencionAtsInfoAdicionalService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
