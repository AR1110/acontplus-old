using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiFactElect.Controllers.RetencionAts
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocSustentoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public DocSustentoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        // GET: api/<DocSustentoController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<DocSustentoController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<DocSustentoController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] string json)
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
                return Ok(await _dao.Default("FactElect.RetAts_Doc_Sust_Insert", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar el documento de sustento: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al guardar el documento de sustento"
                });
            }
        }

        // PUT api/<DocSustentoController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] string json)
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
                return Ok(await _dao.Default("FactElect.RetAts_Doc_Sust_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar el documento de sustento: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al actualizar el documento de sustento"
                });
            }
        }

        // DELETE api/<DocSustentoController>/5
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
                return Ok(await _dao.Default("FactElect.RetAts_Doc_Sust_Delete", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al eliminar el documento de sustento: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al eliminar el documento de sustento"
                });
            }
        }
    }
}
