using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiRecepcion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoDetalleController : ControllerBase
    {
        private readonly IConfiguration _config;
        public DocumentoDetalleController(IConfiguration config)
        {
            _config = config;
        }
        // GET: api/<DocumentoDetalleController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<DocumentoDetalleController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<DocumentoDetalleController>
        [HttpPost("{idDocumento}/{idArticulo}")]
        public async Task<IActionResult> Post(int idDocumento, int idArticulo)
        {   
            LogWriter _log = new LogWriter(_config);
            GenericResponse _response = new GenericResponse();
            try
            {
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                _params["idDocumento"] = idDocumento;
                _params["idArticulo"] = idArticulo;
                DAO _dao = new DAO(_config);
                _response = await _dao.Default("Recepcion.DocumentoDetalle_Insert", _params);
            }
            catch (Exception ex)
            {
                _log.LogError("Error on DocumentoDetalle/Post: " + idDocumento.ToString() + "-> \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar el detalle");
            }
            return Ok(_response);
        }

        // PUT api/<DocumentoDetalleController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<DocumentoDetalleController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _log = new LogWriter(_config);
            GenericResponse _response = new GenericResponse();
            try
            {
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                _params["id"] = id;
                DAO _dao = new DAO(_config);
                _response = await _dao.Default("Recepcion.DocumentoDetalle_Delete", _params);
            }
            catch (Exception ex)
            {
                _log.LogError("Error on DocumentoDetalle/Delete: " + id.ToString() + "-> \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el articulo del stock");
            }
            return Ok(_response);
        }
    }
}
