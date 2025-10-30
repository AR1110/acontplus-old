namespace Accounting.Domain.Repositories;

public interface IMovimientoCajaRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
}
