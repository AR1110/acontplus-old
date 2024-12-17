namespace Common.API.Interfaces;

public interface INotificationService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(int id);
    Task<ApiResponse> GetAsync();
}
