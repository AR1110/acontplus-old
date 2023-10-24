using DataAccess;
using Domain.Models.Config;
using Lib.Common.Api;
using Lib.Common.DbUtils; 
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiConfig.Controllers.Sri
{
    [Route("api/[controller]")]
    [ApiController]
    public class PtoEmiAsigController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public PtoEmiAsigController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.PtoEmi_Asig_Get", true);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de PtoEmi_Asig_Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de PtoEmi_Asig_Get");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
         


        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PtoEmiAsig data)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.PtoEmi_Asig_Insert", true);
                _db.AddDynamicParam("id", idUsuarioRol);
                _db.AddDynamicParam("id", data.idPtoEmi_Asig);
                _db.AddDynamicParam("codEstab_Asig", data.codEstab_Asig);
                _db.AddDynamicParam("idPuntoEmision", data.idPuntoEmision);                
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear PtoEmi_Asig_Insert: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear PtoEmi_Asig_Insert");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.PtoEmi_Asig_Update", true);
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id); 
                _db.AddDynamicParam("predeterminado", true); 
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Update Config.PtoEmi_Asig_Update: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar Config.PtoEmi_Asig_Update");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        
    }
}
