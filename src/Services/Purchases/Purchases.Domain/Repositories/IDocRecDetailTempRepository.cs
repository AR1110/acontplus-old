namespace Purchases.Domain.Repositories;

public interface IDocRecDetailTempRepository
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
