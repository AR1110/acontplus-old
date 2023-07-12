using Services.Common.Logs;
using DataAccess;
using Domain.Dtos;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntidadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public EntidadController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.aspEntidad_Get");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al obtener lista de entidades : \n" + ex.ToString());
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
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.aspEntidad_Insert");
                _db.AddDynamicParam("ruc", data.ruc);
                _db.AddDynamicParam("razonSocial", data.razonSocial);
                _db.AddDynamicParam("nombreComercial", data.nombreComercial);
                _db.AddDynamicParam("email", DataHelper.ToDBNullOrDefault(data.email));
                _db.AddDynamicParam("telefono", DataHelper.ToDBNullOrDefault(data.telefono));
                _db.AddDynamicParam("direccion", DataHelper.ToDBNullOrDefault(data.direccion));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al crear entidad : \n" + ex.ToString());
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
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.aspEntidad_Update");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("ruc", data.ruc);
                _db.AddDynamicParam("idCiudad", data.idCiudad);
                _db.AddDynamicParam("razonSocial", data.razonSocial);
                _db.AddDynamicParam("nombreComercial", data.nombreComercial);
                _db.AddDynamicParam("email", DataHelper.ToDBNullOrDefault(data.email));
                _db.AddDynamicParam("telefono", DataHelper.ToDBNullOrDefault(data.telefono));
                _db.AddDynamicParam("direccion", DataHelper.ToDBNullOrDefault(data.direccion));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al crear entidad : \n" + ex.ToString());
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
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("App.aspEntidad_Delete");
                _db.AddDynamicParam("id", id);               
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al eliminar entidad : \n" + ex.ToString());
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
