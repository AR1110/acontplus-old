namespace TechnicalSupport.API.Services;

public class StatsService : IStatsService
{
    private readonly IAdoRepository _repository;

    public StatsService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("TechnicalSupport.Stats_Get", parameters);
    }
}
