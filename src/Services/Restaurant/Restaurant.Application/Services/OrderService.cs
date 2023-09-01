using Lib.Common;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IADORepository _repository;
        public OrderService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Order_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }
        public async Task<object> ConvertToDocAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Order_Convert_Doc_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }

        }

        public async Task<string> AddAsync(ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                { "userRoleId", data.UserRoleId },
                { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data)) }
            };
            return await _repository.SPExecuteAsync("Restaurant.Order_Insert", parameters);
        }

        public async Task<string> PrintAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.Order_Print", parameters);
        }

        public async Task<string> PutAsync(int id, ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                { "userRoleId", data.UserRoleId },
                { "id", id },
                { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data)) }
            };
            return await _repository.SPExecuteAsync("Restaurant.Order_Update", parameters);
        }
    }
}
