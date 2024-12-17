namespace Common.API.Services;

public interface IWhatsappMessageService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
}

public class WhatsappMessageService(IAdoRepository adoRepository) : IWhatsappMessageService
{
    private const string ModuleName = "Common.WhatsAppMessage_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }
}
