using Common.Infrastructure.Repository;
using Lib.Common.Api;
using Lib.Common.DbUtils;
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
            var ds = await _repository.GetDataSetAsync("RestaurantContext", "Restaurant.Promotion_Get", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }
        
        public async Task<string> PostAsync(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"json", SqlStringParam.Sanitize(Converters.SerializeDictionary(request.Data))}
            };
            return await _repository.SPExecuteAsync("RestaurantContext", "Restaurant.Promotion_Post", parameters);
        }

        public async Task<string> PutAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", SqlStringParam.Sanitize(Converters.SerializeDictionary(request.Data))}
            };
            return await _repository.SPExecuteAsync("RestaurantContext", "Restaurant.Promotion_Update", parameters);
        }
    }
}
