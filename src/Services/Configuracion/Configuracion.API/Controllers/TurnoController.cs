using Configuracion.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Extensions;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnoController : ControllerBase
    {
        private readonly ITurnoService _turnoSvc;
        private readonly ICustomLogger _log;
        public TurnoController(ITurnoService turnoSvc, ICustomLogger log)
        {
            _turnoSvc = turnoSvc;
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
                var response = await _turnoSvc.GetAsync(parameters);
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
