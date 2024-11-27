using System.Data;
using Common.AppSettings;
using Common.Core.Utils;
using Common.Infrastructure.Repository.Interfaces;
using Mechanical.API.Data;
using Mechanical.API.Interfaces;

namespace Mechanical.API.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IAdoRepository _repository;
        private readonly MechanicalContext _context;

        public VehicleService(MechanicalContext context, IAdoRepository repository)
        {
            _context = context;
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Mechanical.VehicleCompany_Get", parameters);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                if (ds.Tables.Count > 0)
                {
                    _ = new DataSet();
                }
                return null;
            }
            else
            {
                return DataConverters.DataSetToJson(ds);
            }
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Mechanical.VehicleCompany_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Mechanical.VehicleCompany_Update", parameters);
        }
        public async Task<LegacyApiResponse> DeleteAsync(int id)
        {
            var vehicle = await _context.VehicleCompanys.FindAsync(id);
            vehicle.Enabled = false;
            vehicle.Deleted = true;
            _context.Update(vehicle);
            await _context.SaveChangesAsync();
            return new LegacyApiResponse { code = "1", message = "Eliminada Exitosamente" };
        }
        public async Task<LegacyApiResponse> UpdateStateAsync(int id, bool state)
        {
            var vehicle = await _context.VehicleCompanys.FindAsync(id);
            vehicle.Enabled = state;
            _context.Update(vehicle);
            await _context.SaveChangesAsync();
            return new LegacyApiResponse { code = "1", message = "Actualizado Exitosamente" };
        }
    }
}
