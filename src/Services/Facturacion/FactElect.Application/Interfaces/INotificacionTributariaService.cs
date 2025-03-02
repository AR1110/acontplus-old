namespace FactElect.Application.Interfaces;

public interface INotificacionTributariaService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
