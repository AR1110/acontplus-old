using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Utils;
using Configuracion.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common.Extensions;
using Common.Core.Models;

namespace Configuracion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserCustomerRoleController : ControllerBase
    {
        private readonly IUserCustomerRoleService _service;
        private readonly ICustomLogger _log;

        public UserCustomerRoleController(IUserCustomerRoleService service, ICustomLogger log)
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
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en get " + ex.Message);
                return BadRequest("Error en get " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"id", id },
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
                };
                var response = await _service.UpdateAsync(parameters); 
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en put " + ex.Message);
                return BadRequest("Error en put " + ex.Message);
            }
        }

    }
}
