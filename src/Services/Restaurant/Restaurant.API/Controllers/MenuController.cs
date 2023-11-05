using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;

namespace Restaurant.API.Controllers
{
    public class MenuController : BaseApiController
    {
        private readonly IMenuService _menuService;
        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", json }
                };
                var response = await _menuService.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest("Error on get: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Error on put: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            try
            {
                data.UserRoleId = User.GetUserRoleId();
                var response = await _menuService.PutAsync(id, data);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
