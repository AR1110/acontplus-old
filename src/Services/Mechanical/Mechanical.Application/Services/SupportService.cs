using System.Data;
using Common.Infrastructure.Repository;
using Lib.Common;
using Mechanical.Core.Interfaces;
using Mechanical.Infrastructure.Data;

namespace Mechanical.Application.Services
{
    public class SupportService : ISupportService
    {
        private readonly IADORepository _repository;
        private readonly MechanicalContext _context;


        public SupportService(MechanicalContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("MechanicalContext", "Mechanical.Support_Get", parameters);

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
            return await _repository.SPExecuteAsync("MechanicalContext", "Mechanical.Support_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("MechanicalContext", "Mechanical.Support_Update", parameters);
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var support = await _context.Supports.FindAsync(id);
            if (support == null) return false;
            support.Enabled = false;
            support.Deleted = true;
            support.UpdatedAt = DateTime.Now;
            support.Status = 5; 
            _context.Update(support);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
