using Common.Core.Interfaces;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IAdoRepository _repository;

        public PromotionService(IAdoRepository repository)
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
                return DataConverters.DataSetToJson(ds);
            }
        }

        public async Task<string> PostAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.Promotion_Post", parameters);
        }

        public async Task<string> PutAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.Promotion_Update", parameters);
        }
    }
}
