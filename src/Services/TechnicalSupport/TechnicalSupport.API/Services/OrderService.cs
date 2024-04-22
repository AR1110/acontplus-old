using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Interfaces;
namespace TechnicalSupport.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly TechnicalSupportContext _context;
        private readonly IADORepository _repository;
        private readonly string _module = "TechnicalSupport.Order_";
        public OrderService(TechnicalSupportContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var ds = await _repository.GetDataSetAsync($"{_module}Get", parameters);
                if (DataValidation.DataSetIsNull(ds, true))
                {
                    return new ApiResponse { code = "0", message = "No se encontraron datos" };
                }
                else
                {
                    return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            try
            {
                return await _repository.SPExecuteAsync($"{_module}Insert", parameters);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            try
            {
                return await _repository.SPExecuteAsync($"{_module}Update", parameters);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            try
            {
                return await _repository.SPExecuteAsync($"{_module}Delete", parameters);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
