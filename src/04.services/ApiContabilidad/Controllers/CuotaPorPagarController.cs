using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using static System.Reflection.Metadata.BlobBuilder;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiContabilidad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuotaPorPagarController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public CuotaPorPagarController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/<CuotaPorPagarController>
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["json"] = SqlValidation.ValidateSqlString(json);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataTable("Contabilidad.CuotaPorPagar_Get", _params));

            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener datos de Cuota Por Pagar: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener datos de Cuotas Por Pagar"
                });

            }
        }

        // GET api/<CuotaPorPagarController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CuotaPorPagarController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<CuotaPorPagarController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CuotaPorPagarController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
