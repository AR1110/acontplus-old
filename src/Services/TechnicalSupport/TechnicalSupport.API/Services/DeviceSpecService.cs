namespace TechnicalSupport.API.Services;

public class DeviceSpecService : IDeviceSpecService
{
    private readonly TechnicalSupportContext _context;
    private readonly IAdoRepository _repository;

    public DeviceSpecService(IAdoRepository repository, TechnicalSupportContext context)
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
        var itemFounded = await _context.DeviceSpecs.FindAsync(id);
        if (itemFounded == null)
        {
            return new ApiResponse { Code = "0", Message = "No se encontró registro de especificaciones" };
        }

        itemFounded.Specs = data.Specs;
        itemFounded.UserId = data.UserId;
        _context.Update(itemFounded);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Especificaciones actualizado exitosamente " };
    }
}
