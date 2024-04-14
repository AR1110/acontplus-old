using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Interfaces;
namespace TechnicalSupport.API.Services
{
    public class OrderMaintenanceService : IOrderMaintenanceService
    {
        private readonly TechnicalSupportContext _context;
        private readonly IADORepository _repository;
        public OrderMaintenanceService(TechnicalSupportContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("TechnicalSupport.OrderMantenaince_Get", parameters);

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
                return await _repository.SPExecuteAsync("TechnicalSupport.OrderMantenaince_Insert", parameters);
            }
            catch (Exception ex)
            {
                return new ApiResponse { code = "0", message = ex.Message };
            }
        }
        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            try
            {
                return await _repository.SPExecuteAsync("TechnicalSupport.OrderMantenaince_Update", parameters);
            }
            catch (Exception ex)
            {
                return new ApiResponse { code = "0", message = ex.Message };
            }
        }

        public async Task<ApiResponse> DeleteAsync(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);

                if (order != null)
                {
                    return new ApiResponse { code = "0", message = "No se ha encontrado item para eliminar" };
                }

                order.Enabled = false;
                order.Deleted = true;

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                return new ApiResponse { code = "1", message = "Eliminado exitosamente" };
            }
            catch (Exception ex)
            {
                return new ApiResponse { code = "0", message = ex.Message };
            }
        }
    }
}
