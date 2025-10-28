namespace Compras.Domain.Repositories;

public interface IDocumentoDetalleRepository
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
}
