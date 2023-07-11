using Services.Common.Logs;
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
        private readonly DbAccess _db;
        public RetAtsInfoAdicionalController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
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
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_InfoAdicional_Insert");

                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idUsuarioRol", idUsuarioRol },
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar la InfoAdicional: " + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar la InfoAdicional");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        // PUT api/<RetAtsInfoAdicionalController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_InfoAdicional_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al actualizar la InfoAdicional: " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar la InfoAdicional");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        // DELETE api/<RetAtsInfoAdicionalController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_InfoAdicional_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al eliminar la InfoAdicional: " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar la InfoAdicional");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
