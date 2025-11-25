namespace Inventory.Api.Controllers;

public class LotPriceController(ILotPriceService lotPriceService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<SpResponse>> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await lotPriceService.GetAsync(parameters);
        return response == null ? (ActionResult<SpResponse>)NoContent() : (ActionResult<SpResponse>)Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult> Put([FromBody] LotPriceDto dto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<LotPriceDto>(dto)) }
        };
        var response = await lotPriceService.UpdateAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }
}
