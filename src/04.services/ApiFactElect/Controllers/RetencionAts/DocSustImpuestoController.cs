using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiFactElect.Controllers.RetencionAts
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocSustImpuestoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public DocSustImpuestoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        // GET: api/<DocImpuestoController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<DocImpuestoController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<DocImpuestoController>
        [HttpPost("{idDocSust}")]
        public async Task<IActionResult> Post(int idDocSust, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idUsuarioRol", idUsuarioRol },
                    { "idDocSust", idDocSust },
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                return Ok(await _dao.Default("FactElect.RetAts_Doc_Sust_Imp_Insert", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar el impuesto: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al guardar el impuesto"
                });
            }
        }

        // PUT api/<DocImpuestoController>/5
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
                return Ok(await _dao.Default("FactElect.RetAts_Doc_Sust_Imp_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar el impuesto: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al actualizar el impuesto"
                });
            }
        }

        // DELETE api/<DocImpuestoController>/5
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
                return Ok(await _dao.Default("FactElect.RetAts_Doc_Sust_Imp_Delete", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al eliminar el impuesto: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al eliminar el impuesto"
                });
            }
        }
    }
}
