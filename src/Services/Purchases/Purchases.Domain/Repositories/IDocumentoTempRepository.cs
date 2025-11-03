namespace Purchases.Domain.Repositories;

public interface IDocumentoTempRepository
{
    public Task<int> AddAsync(Dictionary<string, object> parameters);
}