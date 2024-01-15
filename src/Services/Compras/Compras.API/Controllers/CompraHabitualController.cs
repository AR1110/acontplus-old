using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Compras.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompraHabitualController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public CompraHabitualController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }
        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            ApiResponse _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Recepcion.CompraHabitual_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar");

                _log.LogActivity("Error on Get compra habitual: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
        {
            DbAccess _db = new DbAccess(_configuration);
            ApiResponse _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Recepcion.CompraHabitual_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar");

                _log.LogActivity("Error on Post compra habitual: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut("Put")]
        public async Task<IActionResult> Put(int id, string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            ApiResponse _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Recepcion.CompraHabitual_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", json);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar");

                _log.LogActivity("Error on Put compra habitual: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            ApiResponse _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Recepcion.CompraHabitual_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar");

                _log.LogActivity("Error on Delete compra habitual: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
