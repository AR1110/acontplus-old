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
    public class MassiveTaxChangeController : ControllerBase
    {
        private readonly IMassiveTaxChangeService _service;
        private readonly LogWriter _log;

        public MassiveTaxChangeController(IMassiveTaxChangeService service, LogWriter log)
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

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _service.AddAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Insertar CAMBIOS MASIVOS DE IVA" + ex.Message);
                return BadRequest("Error en Post MASSIVE TAX CHANGE" + ex.Message);
            }
        }

    }
}
