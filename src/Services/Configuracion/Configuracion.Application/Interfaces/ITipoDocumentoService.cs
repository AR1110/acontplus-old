namespace Configuracion.Application.Interfaces;

public interface ITipoDocumentoService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
