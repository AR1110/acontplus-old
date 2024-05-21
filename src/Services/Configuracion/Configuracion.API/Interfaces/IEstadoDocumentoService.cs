namespace Configuracion.API.Interfaces;

public interface IEstadoDocumentoService
{
    Task<ApiResponse> GetAsync(string json);
}
