using Common.Core.Interfaces;
using Common.Core.Models;
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
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var ds = await _repository.GetDataSetAsync("TechnicalSupport.Device_Get", parameters);
                if (DataValidation.DataSetIsNull(ds))
                {
                    return new ApiResponse { code = "1", message = "No se encontraron datos"};
                }
                else
                {
                    return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
