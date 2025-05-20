namespace Configuracion.Application.Services.Notifications;

public interface IWhatsappUsageService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}

public class WhatsappUsageService(IAdoRepository adoRepository) : IWhatsappUsageService
{
    private const string ModuleName = "Config.WhatsappUsage_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Get", parameters, false);
    }
}
