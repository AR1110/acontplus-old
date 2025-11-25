namespace Inventory.Api.Controllers;

public class MassiveTaxController(IMassiveTaxService massiveTaxService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "json", SqlStringParam.Sanitize(json) }
    };
        var response = await massiveTaxService.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] MassiveTaxDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<MassiveTaxDto>(dto)) }
    };
        var response = await massiveTaxService.UpdateAsync(parameters);
        return Ok(response);
    }
}