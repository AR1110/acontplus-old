namespace Purchases.Infrastructure.Persistence.Repositories;

public class DocumentoDetalleRepository(IAdoRepository adoRepository) : IDocumentoDetalleRepository
{
    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Recepcion.DocumentoDetalle_Insert", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Recepcion.DocumentoDetalle_Delete", parameters);
    }
}
