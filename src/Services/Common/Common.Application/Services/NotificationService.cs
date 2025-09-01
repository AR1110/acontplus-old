namespace Common.Application.Services;

public class NotificationService(IAdoRepository adoRepository) : INotificationService
{
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Common.Notification_Insert", parameters);
    }

    public Task<ApiResponse> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }
}
