using Common.Core.Interfaces;
using Common.Core.Utils;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class PromotionMenuService : IPromotionMenuService
    {
        private readonly IAdoRepository _repository;

        public PromotionMenuService(IAdoRepository repository)
        {
            _repository = repository;
        }


        public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Promotion_Menu_Get_By_Id", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJson(ds);
            }
        }
    }
}
