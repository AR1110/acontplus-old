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
            if (DataValidation.DataSetIsNull(ds, true))
            {
                return new ApiResponse { code = "0", message = "No se encontraron datos" };
            }
            else
            {
                return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
            }
        }
        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
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
        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("TechnicalSupport.Order_Update", parameters);
        }
        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return new ApiResponse { code = "0", message = "No encontrada" };
            order.Enabled = false;
            order.Deleted = true;   
            order.UserId = userId;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Eliminada exitosamente" };
        }

        public async Task<ApiResponse> ConvertAsync(Dictionary<string, object> parameters)
        {
            try
            {
                return await _repository.SPExecuteAsync("TechnicalSupport.Order_Document_Insert", parameters);
            }
            catch (Exception ex)
            {
                return new ApiResponse { code = "0", message = ex.Message };
            }
        }
    }
}
