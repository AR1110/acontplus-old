namespace Compras.API.Interfaces;

public interface IDocumentoDetalleService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
}
