using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;


namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _item;
        private readonly ICustomLogger _log;

        public ItemController(IItemService item, ICustomLogger log)
        {
            _item = item;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", json}
                };

                var response = await _item.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest("Error on getting items: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var response = await _item.GetByIdAsync(id);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error on getting ingredients, testing hot reload: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            try
            {
                data.UserRoleId = User.GetUserRoleId();
                var response = await _item.UpdateAsync(id, data);
                if (response == null | string.IsNullOrEmpty(response))
                {
                    _log.LogActivity("No se pudo actualizar Ítem");
                    return BadRequest("Cant Update");
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en catch \n" + ex.Message);
                return BadRequest("Error on Post: " + ex.Message);
            }
        }
    }
}
