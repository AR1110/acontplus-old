using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionMenuController : ControllerBase
    {
        private readonly IPromotionMenuService _promotionService;
        public PromotionMenuController(IPromotionMenuService promotionService)
        {
            _promotionService = promotionService;
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> Get(int id, string json)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(json)},
                    { "id", id}
                };
                var response = await _promotionService.GetByIdAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest("Error on get: " + ex.Message);
            }
        }
    }
}
