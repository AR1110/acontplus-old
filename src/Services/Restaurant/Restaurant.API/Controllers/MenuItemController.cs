using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Restaurant.API.Controllers
{
    public class MenuItemController : BaseApiController
    {
        private readonly IMenuItemService _menuItem;
        private readonly LogWriter _log;


        public MenuItemController(IMenuItemService menuItem, LogWriter log)
        {
            _menuItem = menuItem;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", SqlStringParam.Sanitize(json) }
                };
                var response = await _menuItem.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on get MenuItems: \n" + ex.ToString());
                return BadRequest("Error al obtener los detalles: " + ex.Message);
            }
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id, string json)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId() },
                    {"id", id },
                    {"json", json}
                };
                var response = await _menuItem.GetIdAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on get MenuItems: \n" + ex.ToString());
                return BadRequest("Error al obtener los detalles: " + ex.Message);
            }
        }
    }
}
