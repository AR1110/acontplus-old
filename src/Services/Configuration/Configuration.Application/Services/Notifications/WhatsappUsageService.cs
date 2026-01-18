using Configuration.Application.Interfaces.Notifications;

namespace Configuration.Application.Services.Notifications;

public class WhatsappUsageService(IAdoRepository adoRepository) : Interfaces.Notifications.IWhatsappUsageService
{
    private const string ModuleName = "Config.WhatsappUsage_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Get", parameters);
    }
}
