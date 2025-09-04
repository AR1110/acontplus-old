namespace Configuracion.Application.Services.Notifications;

public interface IWhatsappUsageService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}

public class WhatsappUsageService(IAdoRepository adoRepository) : IWhatsappUsageService
{
    private const string ModuleName = "Config.WhatsappUsage_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Get", parameters);
    }
}
