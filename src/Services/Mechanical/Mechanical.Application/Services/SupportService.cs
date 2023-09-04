using System.Data;
using Lib.Common;
using Mechanical.Core.Interfaces;

namespace Mechanical.Application.Services
{
    public class SupportService : ISupportService
    {
        private readonly IADORepository _repository;

        public SupportService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Mechanical.Support_Get", parameters);

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
    }
}
