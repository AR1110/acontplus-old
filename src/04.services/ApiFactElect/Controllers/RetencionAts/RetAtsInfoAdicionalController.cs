using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiFactElect.Controllers.RetencionAts
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetAtsInfoAdicionalController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public RetAtsInfoAdicionalController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/<RetAtsInfoAdicionalController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<RetAtsInfoAdicionalController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<RetAtsInfoAdicionalController>
        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idUsuarioRol", idUsuarioRol },
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                return Ok(await _dao.Default("FactElect.RetAts_InfoAdicional_Insert", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar la InfoAdicional: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al guardar la InfoAdicional"
                });
            }
        }

        // PUT api/<RetAtsInfoAdicionalController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idUsuarioRol", idUsuarioRol },
                    { "id", id },
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                return Ok(await _dao.Default("FactElect.RetAts_InfoAdicional_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar la InfoAdicional: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al actualizar la InfoAdicional"
                });
            }
        }

        // DELETE api/<RetAtsInfoAdicionalController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idUsuarioRol", idUsuarioRol },
                    { "id", id }
                };
                return Ok(await _dao.Default("FactElect.RetAts_InfoAdicional_Delete", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al eliminar la InfoAdicional: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al eliminar la InfoAdicional"
                });
            }
        }
    }
}
