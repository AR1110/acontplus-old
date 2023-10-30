using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WhatsappMessageController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public WhatsappMessageController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }
        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.WhatsAppMessage_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

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
        public async Task<IActionResult> PostApp([FromBody] ApiRequest parameters)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.WhatsAppMessage_Insert_v2");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

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
