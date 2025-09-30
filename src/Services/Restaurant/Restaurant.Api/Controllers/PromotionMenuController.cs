using Microsoft.AspNetCore.Mvc;

namespace Restaurant.API.Controllers;

public class PromotionMenuController(IPromotionMenuService promotionMenuService) : BaseApiController
{
    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> Get(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) },
            { "id", id }
        };

        return Ok(await promotionMenuService.GetByIdAsync(parameters));
    }
}
