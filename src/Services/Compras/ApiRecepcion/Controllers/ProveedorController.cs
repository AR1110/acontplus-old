using DataAccess;
using Lib.Common;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiRecepcion.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public ProveedorController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(configuration);
            _log = log;
        }

        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Proveedor_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("jsonData", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener el proveedor: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener el proveedor");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);

        }
        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {

            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Proveedor_Insert");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("jsonData", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al registrar el proveedor: " + ex.ToString());
                _response.Create(code: "0", message: "Error al registrar el proveedor");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut("{json}")]
        public async Task<IActionResult> Put(string json)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Proveedor_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("jsonData", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar el proveedor: " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el proveedor");
            }
            finally
            {
                _db.Close();
            }

            return Ok(_response);
        }
    }
}
