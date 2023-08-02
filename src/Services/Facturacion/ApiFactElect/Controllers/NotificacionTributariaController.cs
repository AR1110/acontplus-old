using Services.Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Lib.Common;

namespace ApiFactElect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificacionTributariaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public NotificacionTributariaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("FactElect.Notificacion_Tributaria_Get");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al obtener las notificaciones");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on get NotificacionTrib: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("FactElect.Notificacion_Tributaria_Insert");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value)); 
                _db.AddDynamicParam("json", Converters.SerializeDictionary(parameters.data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar las notificacion");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on post NotificacionTrib: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
