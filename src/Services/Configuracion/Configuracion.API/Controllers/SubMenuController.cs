using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubMenuController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public SubMenuController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }
        [HttpGet("FindByIdMenu/{idMenu}")]
        public async Task<IActionResult> FindByIdMenu(int idMenu)
        {

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.SubMenu_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("idMenu", idMenu);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error getting data submenu by idMenu: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los datos por idMenu");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost()]
        public async Task<IActionResult> Post(string json)
        {

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.SubMenu_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error insert data submenu  : \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar submenu");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.SubMenu_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error update data submenu: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar submenu");
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
                await _db.SPExecute("Config.SubMenu_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error deleting the submenu: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el submenu");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
