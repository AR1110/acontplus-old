namespace Configuracion.Application.Services;

public interface ITipoDocumentoService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}

public class TipoDocumentoService(IAdoRepository adoRepository) : ITipoDocumentoService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Config.TipoDocumento_Get", parameters);
    }
}