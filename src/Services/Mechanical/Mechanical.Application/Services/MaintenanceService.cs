using System.Data;
using Common.Infrastructure.Repository;
using Lib.Common;
using Mechanical.Core.Interfaces;
using Mechanical.Infrastructure.Data;

namespace Mechanical.Application.Services
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly IADORepository _repository;
        private readonly MechanicalContext _context;

        public MaintenanceService(MechanicalContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("MechanicalContext", "Mechanical.Maintenance_Get", parameters);

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
            return await _repository.SPExecuteAsync("MechanicalContext", "Mechanical.Maintenance_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("MechanicalContext", "Mechanical.Maintenance_Update", parameters);
        }
    }
}
