using Common.AppSettings;

namespace Configuracion.API.Interfaces;

public interface IEstadoDocumentoService
{
    Task<LegacyApiResponse> GetAsync(string json);
}
