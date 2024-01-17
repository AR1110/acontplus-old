using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FactElect.API.Controllers.RetencionAts
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocSustImpuestoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public DocSustImpuestoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
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

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_Doc_Sust_Imp_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("idDocSust", idDocSust);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al guardar el impuesto: " + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar el impuesto");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        // PUT api/<DocImpuestoController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_Doc_Sust_Imp_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar el impuesto: " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el impuesto");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        // DELETE api/<DocImpuestoController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetAts_Doc_Sust_Imp_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar el impuesto: " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el impuesto");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
