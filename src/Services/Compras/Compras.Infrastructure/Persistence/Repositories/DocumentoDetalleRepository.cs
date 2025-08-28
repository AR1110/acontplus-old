namespace Compras.Infrastructure.Persistence.Repositories;

public class DocumentoDetalleRepository(IAdoRepository adoRepository) : IDocumentoDetalleRepository
{
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Recepcion.DocumentoDetalle_Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Recepcion.DocumentoDetalle_Delete", parameters);
    }
}
