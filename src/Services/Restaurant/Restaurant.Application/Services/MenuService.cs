using Common.Core.Interfaces;
using Common.Infrastructure.Repository;
using Lib.Common;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Restaurant.Core.Interfaces;

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
            var ds = await _repository.GetDataSetAsync("Restaurant.Menu_Get", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }

        public async Task<string> PutAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", SqlStringParam.Sanitize(Converters.SerializeDictionary(request.Data))}
            };
            return await _repository.SPExecuteAsync("Restaurant.Menu_Update", parameters);
        }
    }
}
