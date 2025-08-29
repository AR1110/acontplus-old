namespace TechnicalSupport.Application.Services;

public class StatsService : IStatsService
{
    private readonly IAdoRepository _adoRepository;

    public StatsService(IAdoRepository adoRepository)
    {
        _adoRepository = adoRepository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await _adoRepository.SpExecuteAsync<ApiResponse>("TechnicalSupport.Stats_Get", parameters);
    }
}