using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common;
using Inventario.Core.Interfaces;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MassiveTaxController : ControllerBase
    {
        private readonly IMassiveTaxService _service;
        private readonly ICustomLogger _log;

        public MassiveTaxController(IMassiveTaxService service, ICustomLogger log)
        {
            _service = service;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _service.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Obtener Cambios Masivos de Iva" + ex.Message);
                return BadRequest("Error en get Massive Tax Change " + ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _service.UpdateAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Actualizar CAMBIOS MASIVOS DE IVA " + ex.Message);
                return BadRequest("Error en Put     MASSIVE TAX CHANGE " + ex.Message);
            }
        }

    }
}
