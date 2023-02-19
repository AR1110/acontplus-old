using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiRecepcion.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public FacturaController(IConfiguration configuration) => (_configuration) = (configuration);

        [HttpPost("{idRol}")]//large json
        public async Task<IActionResult> Post(int idRol, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idRol },
                    { "jsonComp", SqlValidation.ValidateSqlString(json) }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Recepcion.Factura_Insert", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al insertar la factura: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al insertar la factura"
                });
            }
        }
    }
}
