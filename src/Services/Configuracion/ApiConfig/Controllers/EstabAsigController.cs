using Config.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace ApiConfig.Controllers
{
    public class EstabAsigController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IEstablecimientoAsignacionService _estab;
        private readonly LogWriter _log;
        public EstabAsigController(IEstablecimientoAsignacionService service, LogWriter log)
        {
            _estab = service;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"idRol", User.GetUserRoleId() },
                    {"json", json }
                };
                var response = await _estab.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error in Get: \n" + ex.ToString());
                return BadRequest();
            }
        }
    }
}
