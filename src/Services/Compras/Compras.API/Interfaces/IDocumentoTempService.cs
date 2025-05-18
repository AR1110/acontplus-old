namespace Compras.API.Interfaces;

public interface IDocumentoTempService
{
    public Task<int> AddAsync(Dictionary<string, object> parameters);
}