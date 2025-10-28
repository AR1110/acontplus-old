namespace Compras.Domain.Repositories;

public interface IDocumentoTempRepository
{
    public Task<int> AddAsync(Dictionary<string, object> parameters);
}