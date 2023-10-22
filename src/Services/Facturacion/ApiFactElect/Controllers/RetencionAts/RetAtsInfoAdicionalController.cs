using DataAccess;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiFactElect.Controllers.RetencionAts
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetAtsInfoAdicionalController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public RetAtsInfoAdicionalController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
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

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_InfoAdicional_Insert");

                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idUsuarioRol", idUsuarioRol },
                    { "json", SqlStringParam.Sanitize(json) }
                };
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al guardar la InfoAdicional: " + ex.ToString());
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

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_InfoAdicional_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar la InfoAdicional: " + ex.ToString());
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
                _log.LogActivity("Error al eliminar la InfoAdicional: " + ex.ToString());
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
