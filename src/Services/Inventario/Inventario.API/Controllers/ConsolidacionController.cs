using DataAccess;
using Domain.Dtos;
using Helpers;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using System.Security.Claims;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsolidacionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public ConsolidacionController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }
        [HttpGet]
        public async Task<ActionResult<GenericResponse>> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Consolidacion_Get", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al obtener los datos");
                
                _log.LogActivity("Error on Get: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpPost]
        public async Task<ActionResult<GenericResponse>> Post([FromBody] RequestApiDto parameters)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Consolidacion_Insert", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(Converters.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar");
                
                _log.LogActivity("Error on Post: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpPut]
        public async Task<ActionResult<GenericResponse>> Put(int id, [FromBody] RequestApiDto parameters)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Consolidacion_Update", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(Converters.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al actualizar");
                
                _log.LogActivity("Error on Put: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpDelete]
        public async Task<ActionResult<GenericResponse>> Delete(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Consolidacion_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al eliminar");
                
                _log.LogActivity("Error on Delete: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
    }
}
