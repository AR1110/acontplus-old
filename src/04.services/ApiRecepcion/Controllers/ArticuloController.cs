using BL.Recepcion;
using Common.Logs;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiRecepcion.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ArticuloController(IConfiguration configuration) => (_configuration) = (configuration);

        [HttpGet("{idRol}/{json}")]
        public async Task<IActionResult> Get(int idRol, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idRol },
                    { "jsonData", SqlValidation.ValidateSqlString(json) }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Recepcion.Articulo_Get", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener los articulos: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener los articulos"
                });
            }
        }
    }
}
