using System.Data;
using Common.Core.Utils;
using Common.Infrastructure.Repository.Interfaces;
using Mechanical.API.Data;
using Mechanical.API.Interfaces;

namespace Mechanical.API.Services
{
    public class SupportDetailService : ISupportDetailService
    {
        private readonly IAdoRepository _repository;
        private readonly MechanicalContext _context;

        public SupportDetailService(MechanicalContext context, IAdoRepository repository)
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
                return DataConverters.DataSetToJson(ds);
            }
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Mechanical.SupportDetail_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Mechanical.SupportDetail_Update", parameters);
        }
    }
}
