using Common.Logs;
using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImpresionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ImpresionController(IConfiguration configuration)
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
                _params["idUsuarioRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                _params["json"] = json;
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("ApiPrinter.Impresion_Get", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error getting data to print: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
