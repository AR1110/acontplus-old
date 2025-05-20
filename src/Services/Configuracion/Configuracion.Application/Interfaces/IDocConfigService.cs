namespace Configuracion.Application.Interfaces;

public interface IDocConfigService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
}