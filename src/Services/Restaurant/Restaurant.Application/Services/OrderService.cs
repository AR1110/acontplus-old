using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IADORepository _repository;
        private readonly IRdlcReportService _report;
        public OrderService(IADORepository repository, IRdlcReportService report)
        {
            _repository = repository;
            _report = report;
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
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<string> AddAsync(ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                { "userRoleId", data.UserRoleId },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
            return await _repository.SPExecuteAsync("Restaurant.Order_Insert", parameters);
        }
        public async Task<string> PutAsync(int id, ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                { "userRoleId", data.UserRoleId },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
            return await _repository.SPExecuteAsync("Restaurant.Order_Update", parameters);
        }
        public async Task<string> PrintAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.Order_Print", parameters);
        }
        public async Task<ReportResponse> GetReportAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Order_Report", parameters);
            return _report.GetDynamicReport(ds);
        }
    }
}
