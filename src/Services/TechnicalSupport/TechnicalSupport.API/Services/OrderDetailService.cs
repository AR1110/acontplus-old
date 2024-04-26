using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.EntityFrameworkCore;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class OrderDetailService : IOrderDetailService
    {
        private readonly IADORepository _repository;
        private readonly TechnicalSupportContext _context;
        private readonly string _module = "TechnicalSupport.OrderDetail";
        public OrderDetailService(IADORepository repository, TechnicalSupportContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<ApiResponse> AddAsync(ApiRequest data)
        {
            try
            {
                return await _repository.SPExecuteAsync($"{_module}_Insert", new Dictionary<string, object> { { "userRoleId", data.UserRoleId }, { "json", DataConverters.SerializeDictionary(data.Data) } });
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            try
            {
                if (await _context.OrderMaintenances.AnyAsync(x=>x.OrderDetailId == id && x.Deleted == null))
                {
                    return new ApiResponse { code = "0", message = "No se puede eliminar, este equipo ya tiene mantenimientos en curso" };
                }
                var detailFound = await _context.OrderDetails.FindAsync(id);
                detailFound.Enabled = false;
                detailFound.Deleted = true;
                _context.Update(detailFound);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Eliminada exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse> UpdateAsync(int id, ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object> { 
                    { "userRoleId", data.UserRoleId },
                    { "id", id },
                    { "json", DataConverters.SerializeDictionary(data.Data) }
                };
                return await _repository.SPExecuteAsync($"{_module}_Update", parameters);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
