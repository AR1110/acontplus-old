using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Services;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class PromotionMenuController(IPromotionMenuService promotionMenuService) : BaseApiController
{
    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> Get(int id, string json)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }, { "id", id }
            };
            var response = await promotionMenuService.GetByIdAsync(parameters);
            if (response == null) { return NoContent(); }

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest("Error on get: " + ex.Message);
        }
    }
}
