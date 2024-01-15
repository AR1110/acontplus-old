using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace FactElect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificacionTributariaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public NotificacionTributariaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("FactElect.Notificacion_Tributaria_Get");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al obtener las notificaciones");

                _log.LogActivity("Error on get NotificacionTrib: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("FactElect.Notificacion_Tributaria_Insert");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar las notificacion");

                _log.LogActivity("Error on post NotificacionTrib: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
