using Common.Core.Models;
using Common.Core.Utils;
using Configuracion.API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserCustomerController : ControllerBase
    {
        private readonly IUserCustomerService _service;
        private readonly ICustomLogger _log;

        public UserCustomerController(IUserCustomerService service, ICustomLogger log)
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
                _log.LogActivity("Error en Post " + ex.Message);
                return BadRequest("Error en Post " + ex.Message);
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
                _log.LogActivity("Error en Update User Customer " + ex.Message);
                return BadRequest("Error en Update User Customer " + ex.Message);
            }
        }
    }
}
