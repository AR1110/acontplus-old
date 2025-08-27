namespace Compras.Domain.Repositories;

public interface IDocumentoDetalleRepository
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}