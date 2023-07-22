using Lib.Common;
using Lib.Common.Api;
using Restaurant.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Application.Services
{
    public class AppFloorService
    {
        private readonly IADORepository _repository;
        private readonly APIResponse _response;

        public async Task<APIResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var dt = await _repository.GetDataTableAsync("Restaurant.Floors_Get", parameters);
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
