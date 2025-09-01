namespace Common.Application.Services;

public class UserReleaseReadService(IAdoRepository AdoRepository) : IUserReleaseReadService
{
    public async Task<ApiResponse> AddAsync(ApiRequest apiRequest)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", apiRequest.UserRoleId }, { "json", DataConverters.SerializeDictionary(apiRequest.Data) }
        };
        return await AdoRepository.SpExecuteAsync<ApiResponse>("Common.UserReleaseRead_Insert", parameters);
    }
}