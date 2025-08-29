namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class DeviceRepository : IDeviceRepository
{
    private readonly IAdoRepository _adoRepository;
    private readonly TechnicalSupportContext _context;

    public DeviceRepository(IAdoRepository adoRepository, TechnicalSupportContext context)
    {
        _context = context;
        _adoRepository = adoRepository;
    }

    public async Task<ApiResponse> AddAsync(Device device)
    {
        if (device.Customers.Count > 0)
        {
            foreach (var product in device.Customers) product.CreatedByUserId = device.CreatedByUserId;
        }

        device.Specs.CreatedByUserId = device.CreatedByUserId;
        _context.Devices.Add(device);
        await _context.SaveChangesAsync();
        device.Id = device.Id;
        return new ApiResponse { Code = "1", Message = "Registrado exitosamente", Payload = device };
    }

    public async Task<ApiResponse> DeleteAsync(int id, int userId)
    {
        var device = await _context.Devices.FindAsync(id);
        if (device == null) return new ApiResponse { Code = "0", Message = "No existe el equipo" };

        device.MarkAsDeleted(userId);
        _context.Update(device);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminado Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _adoRepository.GetDataSetAsync("TechnicalSupport.Device_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true))
            return new ApiResponse { Code = "0", Message = "No se encontraron datos" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Device device)
    {
        if (id != device.Id) return new ApiResponse { Code = "0", Message = "El id no coincide" };

        var productFounded = await _context.Devices.FindAsync(id);
        productFounded.ModeloId = device.ModeloId;
        productFounded.Color = device.Color;
        productFounded.IsActive = device.IsActive;
        productFounded.Name = device.Name;
        productFounded.UpdatedByUserId = device.UpdatedByUserId;
        _context.Update(productFounded);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado Exitosamente" };
    }
}
