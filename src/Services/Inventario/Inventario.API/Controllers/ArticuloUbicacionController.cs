
using DataAccess;
using Lib.Common;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticuloUbicacionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public ArticuloUbicacionController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        } 

         

        [HttpPost]
        public async Task<IActionResult> Insert(string json)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Inventario.ArticuloUbicacion_Insert", true);
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);                
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear articulo ubicacion: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear articulo ubicacion");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, string json)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.ArticuloUbicacion_Update", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Update articulo ubicación: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar articulo ubicacion");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.ArticuloUbicacion_Delete", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar articulo ubicacion: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar articulo ubicacion");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
