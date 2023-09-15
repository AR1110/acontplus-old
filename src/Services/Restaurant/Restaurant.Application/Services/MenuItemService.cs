using Common.Infrastructure.Repository;
using Lib.Common;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class MenuItemService : IMenuItemService
    {
        private readonly IADORepository _repository;

        public MenuItemService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("RestaurantContext", "Restaurant.MenuItem_Get", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }

        public async Task<object> GetIdAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("RestaurantContext", "Restaurant.MenuItem_Get_Id", parameters);
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
