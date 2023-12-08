using Common.Core.Interfaces;
using Common.Core.Utils;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class DeviceService : IDeviceService
    {
        private readonly IADORepository _repository;
        public DeviceService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("TechnicalSupport.Product_Get", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }
    }
}
