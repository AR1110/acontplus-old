namespace Common.API.Services;

public class UserReleaseReadService(IAdoRepository repository) : IUserReleaseReadService
{
    public async Task<ApiResponse> AddAsync(ApiRequest apiRequest)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", apiRequest.UserRoleId }, { "json", DataConverters.SerializeDictionary(apiRequest.Data) }
        };
        return await repository.SpExecuteAsync("Common.UserReleaseRead_Insert", parameters);
    }
}
