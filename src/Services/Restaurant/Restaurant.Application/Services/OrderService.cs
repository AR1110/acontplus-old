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
        public async Task<string> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("Restaurant.Order_Get", parameters);
            if (!DataValidation.DataTableIsNull(dt))
            {
                return Converters.DataTableToJSON(dt);
            }
            else
            {
                return null;
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
    }
}
