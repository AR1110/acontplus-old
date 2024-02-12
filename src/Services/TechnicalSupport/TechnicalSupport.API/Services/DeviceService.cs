using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class DeviceService : IDeviceService
    {
        private readonly IADORepository _repository;
        private readonly TechnicalSupportContext _context;
        public DeviceService(IADORepository repository, TechnicalSupportContext context)
        {
            _context = context;
            _repository = repository;
        }

        public async Task<ApiResponse> AddAsync(Device device)
        {
            try
            {
                if (_context.Products.Any(p => p.Name == device.Name && p.Model == device.Model))
                {
                    return new ApiResponse { code = "0", message = "El equipo ya existe en la base de datos" };
                }
                foreach (var product in device.Customers) { product.UserId = device.UserId; };
                device.Specs.UserId = device.UserId;
                _context.Products.Add(device);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Registrado exitosamente", payload = device.Id };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> DeleteAsync(int id, int userId)
        {
            try
            {
                var device = await _context.Products.FindAsync(id);
                if (device == null)
                {
                    return new ApiResponse { code = "0", message = "No existe el equipo" };
                }
                device.Enabled = false;
                device.Deleted = true;
                _context.Update(device);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Eliminado Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var ds = await _repository.GetDataSetAsync("TechnicalSupport.Device_Get", parameters);
                if (DataValidation.DataSetIsNull(ds))
                {
                    return new ApiResponse { code = "1", message = "No se encontraron datos" };
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

        public async Task<ApiResponse> UpdateAsync(int id, Device device)
        {
            try
            {
                if (id != device.Id)
                {
                    return new ApiResponse { code = "0", message = "El id no coincide" };
                }
                var productFounded = await _context.Products.FindAsync(id);
                productFounded.CategoryId = device.CategoryId;
                productFounded.Brand = device.Brand;
                productFounded.Color = device.Color;
                productFounded.Enabled = device.Enabled;
                productFounded.Model = device.Model;
                productFounded.Name = device.Name;
                productFounded.Year = device.Year;
                _context.Update(productFounded);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Actualizado Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
