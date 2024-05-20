using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Models;
using Common.Core.Utils;
using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common.Extensions;

namespace Inventario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MeasureController : ControllerBase
    {
        private readonly IMeasureService _service;
        private readonly ICustomLogger _log;

        public MeasureController(IMeasureService service, ICustomLogger log)
        {
            _service = service;
            _log = log;
        }
        [HttpGet]
        public async Task<ActionResult<ApiResponse>> Get(string json)
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
                _log.LogActivity("Error en get Measure" + ex.Message + '\n' + json);
                return BadRequest("Error en get Medida " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _service.AddAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Post Measure" + ex.Message);
                return BadRequest("Error en Post Measure" + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _service.UpdateAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Update Measure " + ex.Message);
                return BadRequest("Error en Update Measure " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id},
                };
                var response = await _service.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Delete Measure " + ex.Message);
                return BadRequest("Error en Delete Measure " + ex.Message);
            }
        }

    }
}
