using Services.Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsolidacionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ConsolidacionController(IConfiguration configuration)
        {
            _configuration = configuration;
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
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Get: \n" + ex.ToString());
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
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(DataHelper.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Post: \n" + ex.ToString());
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
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(DataHelper.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al actualizar");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Put: \n" + ex.ToString());
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
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Delete: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
    }
}
