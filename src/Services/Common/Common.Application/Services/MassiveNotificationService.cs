namespace Common.Application.Services;

public class MassiveNotificationService(IAdoRepository adoRepository) : IMassiveNotificationService
{
    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Common.Massive_Notification_Insert", parameters);
    }
}
