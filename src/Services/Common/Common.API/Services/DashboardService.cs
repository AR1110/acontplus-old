namespace Common.API.Services;

public class DashboardService(IAdoSqlServer adoSqlServer) : IDashboardService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>("Common.Dashboard_Get", parameters);
    }
}
