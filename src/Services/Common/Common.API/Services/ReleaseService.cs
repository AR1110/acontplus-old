using Common.API.Dtos;

namespace Common.API.Services;

public class ReleaseService(IAdoSqlServer adoSqlServer) : IReleaseService
{
    public async Task<ApiResponse> GetAsync(int userRoleId)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", userRoleId } };
        var releases = await adoSqlServer.DynamicListAsync<ReleaseDto>("Common.Release_Get", parameters);

        if (releases == null || releases.Count == 0)
        {
            return new ApiResponse { Code = "0", Message = "Data not found!" };
        }

        return new ApiResponse { Code = "1", Payload = releases };
    }
}
