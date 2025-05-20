namespace Configuracion.Application.Interfaces.Sri;

public interface IEstablecimientoAsignacionService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetDataFormAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(ApiRequest data);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}