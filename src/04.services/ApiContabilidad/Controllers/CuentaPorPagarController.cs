using Common.Logs;
using DataAccess;
using Domain.Dtos.Contabilidad;
using Helpers;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiContabilidad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuentaPorPagarController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public CuentaPorPagarController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/<CuentaPorPagarController>
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["json"] = SqlValidation.ValidateSqlString(json);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataSet("Contabilidad.CuentaPorPagar_Get", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Cuenta Por Pagar -> Get: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        // POST api/<CuentaPorPagarController>
        [HttpPost("{json}")]
        public async Task<IActionResult> Post(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["json"] = SqlValidation.ValidateSqlString(json);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Contabilidad.CuentaPorPagar_Insert", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Cuenta Por Pagar -> Post: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<CuentaPorPagarController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, CuentaPorPagarDto data)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["idCuentaPorPagar"] = id;
                _params["json"] = SqlValidation.ValidateSqlString(data.cuotas);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("Contabilidad.CuentaPorPagar_Update", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Cuenta Por Pagar -> Put: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<CuentaPorPagarController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            
        }
    }
}
