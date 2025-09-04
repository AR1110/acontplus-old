namespace TechnicalSupport.Application.Services;

public class StatsService : IStatsService
{
    private readonly IAdoRepository _adoRepository;

    public StatsService(IAdoRepository adoRepository)
    {
        _adoRepository = adoRepository;
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>("TechnicalSupport.Stats_Get", parameters);
    }
}
