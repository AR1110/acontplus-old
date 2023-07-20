using Lib.Common;
using Lib.Common.Api;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class AppTableService : IAppTableService
    {
        private readonly IADORepository _repository;
        private readonly APIResponse _response;
        public AppTableService(IADORepository repository)
        {
            _repository = repository;
            _response = new APIResponse();
        }
        public async Task<APIResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var dt = await _repository.GetDataTableAsync("Restaurant.Tables_Get", parameters);
                if (DataValidation.DataTableIsNull(dt))
                {
                    _response.Create(code: "0", "La transacción no devolvio respuesta");
                }
                else
                {
                    _response.Create(code: "1", payload: Converters.DataTableToJSON(dt));
                }
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", "Error on get tables");
            }
            return _response;
        }
    }
}
