namespace Configuracion.API.Services;
public interface IWhatsappMessageService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddDeprecatedAsync(Dictionary<string, object> parameters);
}
public class WhatsappMessageService (IAdoRepository adoRepository): IWhatsappMessageService
{
    private const string ModuleName = "Config.WhatsAppMessage_";
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<ApiResponse> AddDeprecatedAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert_v2", parameters);
    }
}
