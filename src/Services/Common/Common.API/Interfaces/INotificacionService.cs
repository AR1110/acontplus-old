namespace Common.API.Interfaces;

public interface INotificacionService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
}
