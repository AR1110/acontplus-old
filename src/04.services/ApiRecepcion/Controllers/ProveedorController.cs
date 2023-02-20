using Common.Logs;
using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiRecepcion.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ProveedorController(IConfiguration configuration) => (_configuration) = (configuration);

        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
                    { "jsonData", json }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataTable("Recepcion.Proveedor_Get", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener el proveedor: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener el proveedor"
                });
            }

        }
        [HttpPost("{json}")]
        public async Task<IActionResult> Post(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
                    { "jsonData", json }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataTable("Recepcion.Proveedor_Insert", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al registrar el proveedor: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al registrar el proveedor"
                });
            }

        }
        [HttpPut("{json}")]
        public async Task<IActionResult> Put(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
                    { "jsonData", json }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Recepcion.Proveedor_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar el proveedor: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al actualizar el proveedor"
                });
            }

        }
    }
}
