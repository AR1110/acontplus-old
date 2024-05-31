using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class MenuService : IMenuService
    {
        private readonly IAdoRepository _repository;
        public MenuService(IAdoRepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Menu_Get", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<string> PutAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))}
            };
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.Menu_Update", parameters);
        }
    }
}
