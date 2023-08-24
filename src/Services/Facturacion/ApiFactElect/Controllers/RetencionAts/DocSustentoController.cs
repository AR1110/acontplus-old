using DataAccess;
using Lib.Common;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiFactElect.Controllers.RetencionAts
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocSustentoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public DocSustentoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
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
        [HttpPost("{idRetencionAts}")]
        public async Task<IActionResult> Post(int idRetencionAts, string json)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_Doc_Sust_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("idRetencionAts", idRetencionAts);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al guardar el documento de sustento: " + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar el documento de sustento");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        // PUT api/<DocSustentoController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_Doc_Sust_Update");
                _db.AddDynamicParam("idUsuarioRol ", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar el documento de sustento: " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el documento de sustento");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        // DELETE api/<DocSustentoController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_Doc_Sust_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();

            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar el documento de sustento: " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el documento de sustento");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
