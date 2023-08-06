using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubMenuController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public SubMenuController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }
        [HttpGet("FindByIdMenu/{idMenu}")]
        public async Task<IActionResult> FindByIdMenu(int idMenu)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.SubMenu_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", idMenu);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error getting data submenu by idMenu: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los datos por idMenu");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.SubMenu_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error deleting the submenu: \n" + ex.ToString());
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
