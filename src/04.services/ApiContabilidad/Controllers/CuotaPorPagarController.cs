using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiContabilidad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuotaPorPagarController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public CuotaPorPagarController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        // GET: api/<CuotaPorPagarController>
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Contabilidad.CuotaPorPagar_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener datos de Cuota Por Pagar: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de Cuotas Por Pagar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
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
