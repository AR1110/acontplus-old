using Common.Logs;
using DataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntidadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public EntidadController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["json"] = json;
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataTable("App.aspEntidad_Get", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error getting data to user: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
