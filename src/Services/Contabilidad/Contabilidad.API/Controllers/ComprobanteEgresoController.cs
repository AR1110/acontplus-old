using Common.Core.Models;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common;

namespace Contabilidad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprobanteEgresoController : ControllerBase
    {
        private readonly IComprobanteEgresoService _svc;
        private readonly LogWriter _log;

        public ComprobanteEgresoController(IComprobanteEgresoService service, LogWriter log)
        {
            _svc = service;
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
                var response = await _svc.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en get comprobantes egreso" + ex.Message);
                return BadRequest("Error en get comprobantes egreso" + ex.Message);
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
                var response = await _svc.AddAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Post comprobantes egreso" + ex.Message);
                return BadRequest("Error en Post comprobantes egreso" + ex.Message);
            }
        }

  

        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id, string observacion)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id},
                    {"observacion", observacion}
                };
                var response = await _svc.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al anular comprobantes egreso: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
