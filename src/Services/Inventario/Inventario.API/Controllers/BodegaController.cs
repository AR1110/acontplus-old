using DataAccess;
using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BodegaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        private readonly DbAccess _db;
        public BodegaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
            _db = new DbAccess(_configuration);
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse(); 
            try
            {
                await _db.SPExecute("Inventario.Bodega_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las bodegas");
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
            GenericResponse _response = new GenericResponse(); 
            try
            {
                await _db.SPExecute("Inventario.Bodega_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Post: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar la bodega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            GenericResponse _response = new GenericResponse(); 
            try
            {
                await _db.SPExecute("Inventario.Bodega_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Put: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar la bodega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            GenericResponse _response = new GenericResponse(); 
            try
            {
                await _db.SPExecute("Inventario.Bodega_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Delete: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al elimianr la bodega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
