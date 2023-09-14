using Lib.Common.Api;
using Lib.Common.DbUtils;
using Lib.Common;
using Mechanical.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;
using Mechanical.Application.Services;

namespace Mechanical.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportController : BaseApiController
    {
        public readonly ISupportService _supportService;
        public readonly LogWriter _log;
        public SupportController(ISupportService supportService, LogWriter log)
        {
            _supportService = supportService;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    { "userRoleId", User.GetUserRoleId()},
                    { "json", json}
                };
                var supports = await _supportService.GetAsync(parameters);
                if (supports == null | string.IsNullOrEmpty((string)supports))
                {
                    return NoContent();
                }
                return Ok(supports);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: \n" + ex.ToString());
                return BadRequest("Error on get");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try

            // Es esto el controlller? si po que no lees ajaa vechiclecontroller
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data))}
                };
                var response = await _supportService.AddAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo guardar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: \n" + ex.ToString());
                return BadRequest("Error On Save");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id,[FromBody] ApiRequest data)
        {
            try

            // Es esto el controlller? si po que no lees ajaa vechiclecontroller
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id },
                    { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data))}
                };
                var response = await _supportService.UpdateAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo guardar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: \n" + ex.ToString());
                return BadRequest("Error On Save");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                bool response = await _supportService.DeleteAsync(id);
                if (!response) { return BadRequest("No se pudo Eliminar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Delete: \n" + ex.ToString());
                return BadRequest("Error on Delete");
            }
        }
    }
}
