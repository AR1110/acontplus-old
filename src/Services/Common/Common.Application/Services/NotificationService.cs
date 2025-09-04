using Acontplus.Core.Abstractions.Persistence;

namespace Common.Application.Services;

public class NotificationService(IAdoRepository adoRepository) : INotificationService
{
    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Common.Notification_Insert", parameters);
    }

    public Task<SpResponse> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }
}
