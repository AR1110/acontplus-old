using Asp.Versioning;
using Common.Core.Models;
using Common.Core.Utils;
using Contabilidad.Application.Servicios;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common;
using Contabilidad.Core.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Contabilidad.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]

    public class CajaController : ControllerBase
    {
        private readonly ICajaService _service;
        private readonly LogWriter _log;

        public CajaController(ICajaService service, LogWriter log)
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
                _log.LogActivity("Error en get " + ex.Message);
                return BadRequest("Error en get " + ex.Message);
            }
        }

        [HttpGet("GetAsigByUser")]
        public async Task<IActionResult> GetAsigCajaUsuario()
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()}
                };
                var response = await _service.GetAsigCajaUsuarioAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en GetByUdser" + ex.Message);
                return BadRequest("Error en get " + ex.Message);
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
                _log.LogActivity("Error en Post " + ex.Message);
                return BadRequest("Error en Post " + ex.Message);
            }
        }
    }
}
