using System.Data;
using Common.Core.Interfaces;
using Common.Core.Utils;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class ConfigurationService : IConfigurationService
    {
        private readonly IAdoRepository _repository;

        public ConfigurationService(IAdoRepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Configuration_Get", parameters);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                if (ds.Tables.Count > 0)
                {
                    ds = new DataSet();
                }
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }
    }
}
