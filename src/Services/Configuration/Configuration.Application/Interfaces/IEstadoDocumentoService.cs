namespace Configuration.Application.Interfaces;

public interface IEstadoDocumentoService
{
    Task<SpResponse> GetAsync(string json);
}
