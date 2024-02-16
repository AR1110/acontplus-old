using Common.Core.Interfaces;
using Common.Core.Models;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class DeviceSpecService : IDeviceSpecService
    {
        private readonly IADORepository _repository;
        private readonly TechnicalSupportContext _context;

        public DeviceSpecService(IADORepository repository, TechnicalSupportContext context)
        {
            _repository = repository;
            _context = context;
        }

        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse> AddAsync(DeviceSpecs data)
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse> UpdateAsync(int id, DeviceSpecs data)
        {
            try
            {
                
                var itemFounded = await _context.DeviceSpecs.FindAsync(id);
                if (itemFounded == null)
                {
                    return new ApiResponse { code = "0", message = "No se encontró registro de especificaciones" };
                }
                itemFounded.Specs = data.Specs;
                _context.Update(itemFounded);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Especificaciones actualizado exitosamente " };
            }
            catch (Exception)
            {
                throw new NotImplementedException();
            }
        }
    }
}
