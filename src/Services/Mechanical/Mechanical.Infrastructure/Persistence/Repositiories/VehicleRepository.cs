namespace Mechanical.Infrastructure.Persistence.Repositiories;

public class VehicleRepository(IAdoRepository _repository, MechanicalContext _context) : IVehicleRepository
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Mechanical.VehicleCompany_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Mechanical.VehicleCompany_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Mechanical.VehicleCompany_Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(int id)
    {
        var vehicle = await _context.VehicleCompanys.FindAsync(id);
        if (vehicle == null)
            return new SpResponse { Code = "0", Message = "No se encontro el Vehículo para actualizar" };
        _context.Remove(vehicle);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<SpResponse> UpdateStateAsync(int id, bool state)
    {
        var vehicle = await _context.VehicleCompanys.FindAsync(id);
        if (vehicle == null)
            return new SpResponse { Code = "0", Message = "No se encontro el Vehículo para actualizar" };
        vehicle.IsActive = state;
        _context.Update(vehicle);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado Exitosamente" };
    }
}
