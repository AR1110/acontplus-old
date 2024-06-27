namespace Common.API.Services;

public class UserReleaseReadService(IAdoSqlServer adoSqlServer) : IUserReleaseReadService
{
    public async Task<ApiResponse> AddAsync(ApiRequest apiRequest)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", apiRequest.UserRoleId }, { "json", DataConverters.SerializeDictionary(apiRequest.Data) }
        };
        return await adoSqlServer.SpExecuteAsync<ApiResponse>("Common.UserReleaseRead_Insert", parameters);
    }
}
