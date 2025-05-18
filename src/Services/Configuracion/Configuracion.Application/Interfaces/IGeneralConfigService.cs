namespace Configuracion.Application.Interfaces;

public interface IGeneralConfigService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}