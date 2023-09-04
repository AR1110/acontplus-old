using System.Data;
using Lib.Common;
using Lib.Common.Api;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using Common.Infrastructure.Repository;

namespace Restaurant.Application.Services
{
    public class ConfigurationService : IConfigurationService
    {
        private readonly IADORepository _repository;
        private readonly RestaurantContext _context;
        private readonly APIResponse _response;

        public ConfigurationService(IADORepository repository)
        {
            _repository = repository;
            _response = new APIResponse();
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("RestaurantContext","Restaurant.Configuration_Get", parameters);

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
                return Converters.DataSetToJSON(ds);
            }
        }
    }
}
