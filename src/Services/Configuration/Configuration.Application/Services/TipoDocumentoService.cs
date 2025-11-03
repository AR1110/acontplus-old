namespace Configuration.Application.Services;

public class TipoDocumentoService(IAdoRepository adoRepository) : ITipoDocumentoService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Config.TipoDocumento_Get", parameters);
    }
}
