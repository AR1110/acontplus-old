using Lib.Common.Api;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionService _promotionService;
        public PromotionController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
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
                var response = await _promotionService.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest("Error on get: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try
            {
                data.UserRoleId = User.GetUserRoleId();
                var response = await _promotionService.PostAsync(data);
                if (response == null) { return NoContent(); }

                return Ok(response);
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
                var response = await _promotionService.PutAsync(id, data);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
