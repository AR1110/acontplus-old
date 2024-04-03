using Common.Core.Interfaces;
using Common.Core.Utils;
using Common.Core.Models;
using Configuracion.API.Interfaces;

namespace Configuracion.API.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly IADORepository _repository;
        private readonly string nameSchema = "Config.UserProfile";

        public UserProfileService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync(nameSchema + "_Update", parameters);
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);

                if (ds == null)
                {
                    return new ApiResponse { code = "0", message = "No se pudo obtener los datos" };
                }

                return new ApiResponse { code = "0", message = "Ok", payload = DataConverters.DataSetToJSON(ds) };
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
