namespace Common.API.Interfaces;

public interface IMassiveNotificationService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
}