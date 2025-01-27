namespace Common.API.Services;

public class MassiveNotificationService(IAdoRepository adoRepository) : IMassiveNotificationService
{
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Common.Massive_Notification_Insert", parameters);
    }
}
