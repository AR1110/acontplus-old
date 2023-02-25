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
    public class ArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ArticuloController(IConfiguration configuration) => (_configuration) = (configuration);

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
