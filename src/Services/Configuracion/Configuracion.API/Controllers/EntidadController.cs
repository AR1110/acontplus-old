using Common.Core.Models;
using Common.Core.Models.Administracion;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntidadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public EntidadController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.aspEntidad_Get");
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener lista de entidades : \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener lista de entidades");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Entidad data)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.aspEntidad_Insert");
                _db.AddDynamicParam("ruc", data.ruc);
                _db.AddDynamicParam("razonSocial", data.razonSocial);
                _db.AddDynamicParam("nombreComercial", data.nombreComercial);
                _db.AddDynamicParam("email", DataValidation.ToDBNullOrDefault(data.email));
                _db.AddDynamicParam("telefono", DataValidation.ToDBNullOrDefault(data.telefono));
                _db.AddDynamicParam("direccion", DataValidation.ToDBNullOrDefault(data.direccion));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear entidad : \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear entidad");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Entidad data)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.aspEntidad_Update");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("ruc", data.ruc);
                _db.AddDynamicParam("idCiudad", data.idCiudad);
                _db.AddDynamicParam("razonSocial", data.razonSocial);
                _db.AddDynamicParam("nombreComercial", data.nombreComercial);
                _db.AddDynamicParam("email", DataValidation.ToDBNullOrDefault(data.email));
                _db.AddDynamicParam("telefono", DataValidation.ToDBNullOrDefault(data.telefono));
                _db.AddDynamicParam("direccion", DataValidation.ToDBNullOrDefault(data.direccion));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear entidad : \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear entidad");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.aspEntidad_Delete");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar entidad : \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar entidad");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
