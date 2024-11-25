using Common.AppSettings;

namespace Inventario.API.Controllers;

public class LotPriceController : BaseApiController
{

    private readonly ILotPriceService _service;

    public LotPriceController(ILotPriceService service)
    {
        _service = service;

    }

    [HttpGet]
    public async Task<ActionResult<LegacyApiResponse>> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
        var response = await _service.GetAsync(parameters);
        if (response == null) { return NoContent(); }

            ;
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
        var response = await _service.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }

            ;
        return Ok(response);
    }
}
