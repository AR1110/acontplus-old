using System.Data;
using Lib.Common;
using Mechanical.Core.Interfaces;

namespace Mechanical.Application.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IADORepository _repository;

        public VehicleService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object?> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Mechanical.VehicleCompany_Get", parameters);

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
                return Converters.DataSetToJSON(ds);
            }
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Mechanical.VehicleCompany_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Mechanical.VehicleCompany_Update", parameters);
        }
        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Mechanical.VehicleCompany_Delete", parameters);
        }
    }
}
