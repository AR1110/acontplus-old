namespace Common.Application.Interfaces;

public interface INotificationService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(int id);
}
