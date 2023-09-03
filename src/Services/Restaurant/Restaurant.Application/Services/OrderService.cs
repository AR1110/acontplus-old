using Lib.Common;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Lib.Common.Dtos;
using Restaurant.Core.Interfaces;
using Common.Infrastructure.Repository;
using Common.Reports.Interfaces;

namespace Restaurant.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IADORepository _repository;
        private readonly IReportService _report;
        public OrderService(IADORepository repository, IReportService report)
        {
            _repository = repository;
            _report = report;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("RestaurantContext", "Restaurant.Order_Get", parameters);
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
            return await _repository.SPExecuteAsync("RestaurantContext", "Restaurant.Order_Insert", parameters);
        }
        public async Task<string> PutAsync(int id, ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                { "userRoleId", data.UserRoleId },
                { "id", id },
                { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data)) }
            };
            return await _repository.SPExecuteAsync("RestaurantContext", "Restaurant.Order_Update", parameters);
        }
        public async Task<string> PrintAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("RestaurantContext", "Restaurant.Order_Print", parameters);
        }
        public async Task<ReportResponseDto> GetReportAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("RestaurantContext", "Restaurant.Order_Report", parameters);
            return _report.GetReportNew(ds);
        }
    }
}
