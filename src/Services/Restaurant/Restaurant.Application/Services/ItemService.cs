using System.Data;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;

namespace Restaurant.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly IADORepository _repository;
        private readonly RestaurantContext _context;
        private readonly ApiResponse _response;

        public ItemService(IADORepository repository)
        {
            _repository = repository;
            _response = new ApiResponse();
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Restaurant.Item_Get", parameters);

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
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<object> GetByIdAsync(int id)
        {
            var parameters = new Dictionary<string, object>{
                {"id", id},
            };
            var ds = await _repository.GetDataSetAsync("Restaurant.Item_GetById", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<string> UpdateAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))}
            };
            return await _repository.SPExecuteAsync("Restaurant.Item_Update", parameters);
        }

        public async Task<string> DeleteAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id}
            };
            return await _repository.SPExecuteAsync("Restaurant.Item_Update_Cancel", request.Data);
        }
    }
}
