using Lib.Common.Api;
using Lib.Common.DbUtils;
using Lib.Common;
using Mechanical.Application.Services;
using Mechanical.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Mechanical.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InspectionController : BaseApiController
    {
        public readonly IInspectionService _inspectionService;
        public readonly LogWriter _log;
        public InspectionController(IInspectionService inspectionService, LogWriter log)
        {
            _inspectionService = inspectionService;
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
                var supports = await _inspectionService.GetAsync(parameters);
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
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data))}
                };
                var response = await _inspectionService.AddAsync(parameters);
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
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id },
                    { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data))}
                };
                var response = await _inspectionService.UpdateAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo guardar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: \n" + ex.ToString());
                return BadRequest("Error On Save");
            }
        }
    }
}
