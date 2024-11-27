using Common.AppSettings;

namespace Inventario.API.Controllers;

public class LotPriceController(ILotPriceService lotPriceService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<LegacyApiResponse>> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await lotPriceService.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult> Put(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        var response = await lotPriceService.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }
}
