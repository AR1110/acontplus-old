using Common.Infrastructure.Repository;
using Lib.Common;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class PromotionMenuService : IPromotionMenuService
    {
        private readonly IADORepository _repository;

        public PromotionMenuService(IADORepository repository)
        {
            _repository = repository;
        }


        public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync( "Restaurant.Promotion_Menu_Get_By_Id", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }        
    }
}
