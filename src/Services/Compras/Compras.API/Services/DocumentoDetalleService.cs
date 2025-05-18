namespace Compras.API.Services;

public class DocumentoDetalleService(IAdoRepository adoRepository) : IDocumentoDetalleService
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