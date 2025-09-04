namespace Inventario.API.Controllers;

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
        if (response == null) return NoContent();

        return Ok(response);
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
        if (response == null) return NoContent();

        return Ok(response);
    }
}
