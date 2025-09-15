namespace Configuracion.Application.Interfaces;

public interface IImportacionService
{
    Task<SpResponse> AddAsync(string codImportacion, Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> ValidateAsync(Dictionary<string, object> parameters);
}
