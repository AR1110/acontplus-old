using Common.AppSettings.Extensions;

namespace Inventario.API.Controllers;

public class MassiveTaxController(IMassiveTaxService massiveTaxService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
        var response = await massiveTaxService.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
        var response = await massiveTaxService.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }
}
