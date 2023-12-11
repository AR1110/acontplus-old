using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Ventas.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstadisticasController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public EstadisticasController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Estadisticas_Dashboard_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar datos para dashboard: " + ex.ToString());
                _response.Create(code: "0", message: "Error al listar datos para dashboard");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
