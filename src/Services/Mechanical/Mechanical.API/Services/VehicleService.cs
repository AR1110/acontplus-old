using Common.Core.Abstractions;
using Mechanical.API.Data;
using Mechanical.API.Interfaces;

namespace Mechanical.API.Services;

public class VehicleService(IAdoRepository _repository, MechanicalContext _context) : IVehicleService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Mechanical.VehicleCompany_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Mechanical.VehicleCompany_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Mechanical.VehicleCompany_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var vehicle = await _context.VehicleCompanys.FindAsync(id);
        if (vehicle == null)
            return new ApiResponse { Code = "0", Message = "No se encontro el Vehículo para actualizar" };
        _context.Remove(vehicle);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<ApiResponse> UpdateStateAsync(int id, bool state)
    {
        var vehicle = await _context.VehicleCompanys.FindAsync(id);
        if (vehicle == null)
            return new ApiResponse { Code = "0", Message = "No se encontro el Vehículo para actualizar" };
        vehicle.IsActive = state;
        _context.Update(vehicle);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado Exitosamente" };
    }
}
