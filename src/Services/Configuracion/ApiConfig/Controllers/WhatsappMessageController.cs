using DataAccess;
using Domain.Dtos;
using Helpers;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WhatsappMessageController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public WhatsappMessageController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromBody] RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.WhatsAppMessage_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", Converters.SerializeDictionary(parameters.data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogActivity("Error while insert whatsapp message: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar el whatsapp");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }



        [HttpPost("PostApp")]
        public async Task<IActionResult> PostApp([FromBody] RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.WhatsAppMessage_Insert_v2");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", Converters.SerializeDictionary(parameters.data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogActivity("Error while insert whatsapp message: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar el whatsapp");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
