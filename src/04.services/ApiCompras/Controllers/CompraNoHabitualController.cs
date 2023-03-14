using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiCompras.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CompraNoHabitualController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CompraNoHabitualController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        // GET: api/<CompraNoHabitualController>
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object> {
                    {"idRol", idUsuarioRol },
                    {"json", SqlValidation.ValidateSqlString(json)}
                };
                return Ok(await _dao.GetDataTable("Compra.CompraNoHabitual_Get", parameters));
            }catch(Exception ex)
            {
                _logs.LogError("Error al obtener datos de Compra No Habitual: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener datos de Compra No Habitual"
                });

            }
        }

        // GET api/<CompraNoHabitualController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                 int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object> {
                    {"idRol", idUsuarioRol },
                    {"id", id}
                };
                return Ok(await _dao.GetDataTable("Compra.CompraNoHabitual_Get_Id", parameters));                
            }catch(Exception ex){
                _logs.LogError("Error al obtener datos de Compra No Habitual: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener datos de Compra No Habitual"
                });

            }
        }

        // POST api/<CompraNoHabitualController>
        [HttpPost]
        public void Post([FromBody] string value)
        {

        }

        // PUT api/<CompraNoHabitualController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CompraNoHabitualController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
