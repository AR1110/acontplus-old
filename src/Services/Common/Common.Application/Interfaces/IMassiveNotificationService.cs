namespace Common.Application.Interfaces;

public interface IMassiveNotificationService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
}