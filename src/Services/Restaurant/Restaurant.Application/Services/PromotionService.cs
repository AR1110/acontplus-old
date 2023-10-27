using Common.Core.Interfaces;
using Common.Infrastructure.Repository;
using Lib.Common;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IADORepository _repository;

        public PromotionService(IADORepository repository)
        {
            _repository = repository;
        }


        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Promotion_Get", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }

        public async Task<string> PostAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.Promotion_Post", parameters);
        }

        public async Task<string> PutAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.Promotion_Update", parameters);
        }
    }
}
