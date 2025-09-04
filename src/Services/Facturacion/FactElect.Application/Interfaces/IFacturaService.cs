namespace FactElect.Application.Interfaces;

public interface IFacturaService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<object> GetByIdAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> CancelAsync(Dictionary<string, object> parameters);
}
