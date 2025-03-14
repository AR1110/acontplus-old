namespace Configuracion.Application.Interfaces;

public interface IEstadoDocumentoService
{
    Task<LegacyApiResponse> GetAsync(string json);
}
