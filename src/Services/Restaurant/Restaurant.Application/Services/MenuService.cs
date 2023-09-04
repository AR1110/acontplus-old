using Lib.Common;
using Restaurant.Core.Interfaces;
using Common.Infrastructure.Repository; 

namespace Restaurant.Application.Services
{
    public class MenuService : IMenuService
    {
        private readonly IADORepository _repository;
        public MenuService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("RestaurantContext","Restaurant.Menu_Get", parameters);
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
