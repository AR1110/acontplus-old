namespace TechnicalSupport.API.Services;

public class StatsService : IStatsService
{
    private readonly IAdoSqlServer _adoSqlServer;

    public StatsService(IAdoSqlServer adoSqlServer)
    {
        _adoSqlServer = adoSqlServer;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await _adoSqlServer.SpExecuteAsync<ApiResponse>("TechnicalSupport.Stats_Get", parameters);
    }
}
