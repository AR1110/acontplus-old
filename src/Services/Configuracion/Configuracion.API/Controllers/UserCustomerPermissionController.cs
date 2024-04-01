using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Utils;
using Configuracion.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common;
using Common.Core.Models;

namespace Configuracion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserCustomerPermissionController : ControllerBase
    {
        private readonly IUserCustomerPermissionService _service;
        private readonly LogWriter _log;

        public UserCustomerPermissionController(IUserCustomerPermissionService service, LogWriter log)
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
                _log.LogActivity("Error en get user customer permission " + ex.Message + "\n" + json);
                return BadRequest("Error en get en get user customer permission" + ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Put(ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _service.UpdateAsync(parameters); 
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Put User Customer Permisison " + ex.Message);
                return BadRequest("Error en Put User Customer Permisison " + ex.Message);
            }
        }
    }
}
