using Common.Logs;
using DataAccess;
using Domain.Config.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public ReporteController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }
        [HttpGet("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.Reporte_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while getting reports: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error getting reports");
            }
            return Ok(_response);
        }
        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromBody] ReporteDto data)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["codigo"] = data.codigo;
                _params["reportPath"] = data.reportPath;
                _params["contentType"] = data.contentType;
                _params["storedProcedure"] = data.storedProcedure;
                _params["nombreReporte"] = data.nombreReporte;
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Config.Reporte_Insert", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while insert report: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("Put/{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ReporteDto data)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["id"] = id;
                _params["json"] = JsonConvert.SerializeObject(data);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Config.Reporte_Update", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while updating report: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["id"] = id;
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Config.Reporte_Delete", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while deleting report: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
