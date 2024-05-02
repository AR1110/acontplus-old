namespace TechnicalSupport.API.Services
{
    public class StatsService : IStatsService
    {
        private readonly IADORepository _repository;

        public StatsService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("TechnicalSupport.Stats_Get", parameters);
        }
    }
}
