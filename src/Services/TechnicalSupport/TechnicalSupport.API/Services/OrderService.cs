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
        public OrderService(TechnicalSupportContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("TechnicalSupport.Order_Get", parameters);
            if (DataValidation.DataSetIsNull(ds))
            {
                return new ApiResponse { code = "0", message = "No se encontraron datos" };
            }
            else
            {
                return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
            }
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            try
            {
                return await _repository.SPExecuteAsync("TechnicalSupport.Order_Insert", parameters);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("TechnicalSupport.Order_Update", parameters);
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return false;
            order.Enabled = false;
            order.Deleted = true;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
