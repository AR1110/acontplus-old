namespace Common.Application.Services;

public class WhatsappMessageService(IAdoRepository adoRepository) : IWhatsappMessageService
{
    private const string ModuleName = "Common.WhatsAppMessage_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }
}
