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
    public class ReporteDataSourceController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ReporteDataSourceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["json"] = SqlValidation.ValidateSqlString(json);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataTable("Config.ReporteDS_Get", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while getting reports: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DataSourceDto data)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["json"] = JsonConvert.SerializeObject(data);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Config.ReporteDS_Insert", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while insert report: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] DataSourceDto data)
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
                return Ok(await _dao.Default("Config.ReporteDS_Update", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while updating report: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
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
                return Ok(await _dao.Default("Config.ReporteDS_Delete", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while deleting report: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
