using System.Data;
using Common.Core.Interfaces;
using Common.Infrastructure.Repository;
using Lib.Common;
using Lib.Common.Api;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;

namespace Restaurant.Application.Services
{
    public class AppTableService : IAppTableService
    {
        private readonly IADORepository _repository;
        private readonly RestaurantContext _context;
        private readonly APIResponse _response;


        public AppTableService(IADORepository repository)
        {
            _repository = repository;
            _response = new APIResponse();
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Restaurant.Tables_Get", parameters);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                if (ds.Tables.Count > 0)
                {
                    ds = new DataSet();
                }
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }

        public async Task<string> AddAsync(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"json", Converters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Restaurant.Table_Insert", parameters);
        }

        public async Task<string> UpdateAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", Converters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Restaurant.Table_Update", parameters);
        }

        public async Task<string> DeleteAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id}
            };
            return await _repository.SPExecuteAsync("Restaurant.Table_Delete", request.Data);
        }
    }
}
