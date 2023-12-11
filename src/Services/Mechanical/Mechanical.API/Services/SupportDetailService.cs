using System.Data;
using Common.Core.Interfaces;
using Common.Core.Utils;
using Mechanical.API.Data;
using Mechanical.API.Interfaces;

namespace Mechanical.API.Services
{
    public class SupportDetailService : ISupportDetailService
    {
        private readonly IADORepository _repository;
        private readonly MechanicalContext _context;

        public SupportDetailService(MechanicalContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Mechanical.SupportDetail_Get", parameters);

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
                return DataConverters.DataSetToJSON(ds);
            }
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Mechanical.SupportDetail_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Mechanical.SupportDetail_Update", parameters);
        }
    }
}
