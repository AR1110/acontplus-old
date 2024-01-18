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
    public class AnticipoController : ControllerBase
    {

        private IAnticipoService _anticipoSvc;
        private LogWriter _log;

        public AnticipoController(IAnticipoService anticipoSvc, LogWriter log)
        {
            _anticipoSvc = anticipoSvc;
            _log = log;

        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _anticipoSvc.GetAsync(new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(json) }
                });
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar Anticipo: \n" + ex.ToString());
                return BadRequest("Error on get Anticipo: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest request)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                {"userRoleId", User.GetUserRoleId()},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };

                var response = await _anticipoSvc.AddAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear Anticipo: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                {"userRoleId", User.GetUserRoleId()},
                    {"id", id },
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };

                var response = await _anticipoSvc.UpdateAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar Anticipo: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id}
                };
                var response = await _anticipoSvc.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar Anticipo: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
