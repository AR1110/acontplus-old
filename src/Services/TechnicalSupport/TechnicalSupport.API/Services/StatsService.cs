using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using TechnicalSupport.API.Interfaces;

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
            try
            {
                return await _repository.SPExecuteAsync("TechnicalSupport.Stats_Get", parameters); 
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
