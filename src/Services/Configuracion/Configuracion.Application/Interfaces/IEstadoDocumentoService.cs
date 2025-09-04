namespace Configuracion.Application.Interfaces;

public interface IEstadoDocumentoService
{
    Task<LegacySpResponse> GetAsync(string json);
}
