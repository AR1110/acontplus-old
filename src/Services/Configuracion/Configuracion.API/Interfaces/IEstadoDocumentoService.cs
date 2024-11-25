using Common.AppSettings;

namespace Configuracion.API.Interfaces;

public interface IEstadoDocumentoService
{
    Task<ApiResponseDeprecated> GetAsync(string json);
}
