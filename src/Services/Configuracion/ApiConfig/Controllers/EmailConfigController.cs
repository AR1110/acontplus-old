using DataAccess;
using Domain.Dtos;
using Helpers;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using System.Security.Claims;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public EmailConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.EmailConfig_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogActivity("Error on Get Email-Config : \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los datos de la configuracion de email");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<ActionResult<GenericResponse>> Put(int id, [FromBody] RequestApiDto parameters)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.EmailConfig_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("idEmailConfig", id);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(Converters.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al actualizar");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogActivity("Error on Put EmailConfig: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }

    }
}
