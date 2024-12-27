using Common.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Common.API.Services;

public class NotificationService(CommonContext context, IAdoRepository adoRepository) : INotificationService
{
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Common.Notification_Insert", parameters);
    }

    public Task<ApiResponse> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<ApiResponse> GetAsync()
    {
        var notifications = await context.Notifications.ToListAsync();
        return new ApiResponse { Code = "1", Payload = notifications };
    }
}
