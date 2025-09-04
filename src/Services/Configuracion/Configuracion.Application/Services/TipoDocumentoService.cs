namespace Configuracion.Application.Services;

public interface ITipoDocumentoService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}

public class TipoDocumentoService(IAdoRepository adoRepository) : ITipoDocumentoService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Config.TipoDocumento_Get", parameters);
    }
}
