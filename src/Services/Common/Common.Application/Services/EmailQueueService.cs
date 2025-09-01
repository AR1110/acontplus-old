namespace Common.Application.Services;

public class EmailQueueService(IAdoRepository adoRepository) : IEmailQueueService
{
    public async Task<ApiResponse> SendAsync(ApiRequest apiRequest)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", apiRequest.UserRoleId },
            { "json", DataConverters.SerializeDictionary(apiRequest.Data) }
        };

        return await adoRepository.SpExecuteAsync<ApiResponse>("Common.EmailQueue_Insert", parameters);
    }
}