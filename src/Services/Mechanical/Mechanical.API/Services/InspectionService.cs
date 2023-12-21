using System.Data;
using Common.Core.Interfaces;
using Common.Core.Utils;
using Mechanical.API.Interfaces;

namespace Mechanical.API.Services
{
    public class InspectionService : IInspectionService
    {
        private readonly IADORepository _repository;


        public InspectionService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Mechanical.Inspection_Get", parameters);

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
            return await _repository.SPExecuteAsync("Mechanical.Inspection_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Mechanical.Inspection_Update", parameters);
        }
    }
}
