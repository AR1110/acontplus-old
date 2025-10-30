namespace Purchases.Domain.Repositories;

public interface IArticuloRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
