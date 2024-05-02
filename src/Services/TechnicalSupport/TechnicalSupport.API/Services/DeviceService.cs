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
            if (_context.Devices.Any(p => p.Name == device.Name && p.ModeloId == device.ModeloId))
            {
                return new ApiResponse { code = "0", message = "El equipo ya existe en la base de datos" };
            }

            if (device.Customers.Count > 0)
            {
                foreach (var product in device.Customers) { product.UserId = device.UserId; };
            }

            device.Specs.UserId = device.UserId;
            _context.Devices.Add(device);
            await _context.SaveChangesAsync();
            device.Id = device.Id;
            return new ApiResponse { code = "1", message = "Registrado exitosamente", payload = device };
        }

        public async Task<ApiResponse> DeleteAsync(int id, int userId)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null)
            {
                return new ApiResponse { code = "0", message = "No existe el equipo" };
            }

            device.Enabled = false;
            device.Deleted = true;
            device.UserId = userId;
            _context.Update(device);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Eliminado Exitosamente" };
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("TechnicalSupport.Device_Get", parameters);
            if (DataValidation.DataSetIsNull(ds, true))
            {
                return new ApiResponse { code = "0", message = "No se encontraron datos" };
            }
            else
            {
                return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
            }
        }

        public async Task<ApiResponse> UpdateAsync(int id, Device device)
        {
            if (id != device.Id)
            {
                return new ApiResponse { code = "0", message = "El id no coincide" };
            }

            var productFounded = await _context.Devices.FindAsync(id);
            productFounded.ModeloId = device.ModeloId;
            productFounded.Color = device.Color;
            productFounded.Enabled = device.Enabled;
            productFounded.Name = device.Name;
            productFounded.UserId = device.UserId;
            _context.Update(productFounded);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Actualizado Exitosamente" };
        }
    }
}
