namespace Billing.Api.Controllers;

public class NotaCreditoController(INotaCreditoService notaCreditoService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await notaCreditoService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] NotaCreditoDtos.CreateNotaCreditoDto data)
    {
        var json = DataConverters.SerializeObjectCustom<NotaCreditoDtos.CreateNotaCreditoDto>(data);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await notaCreditoService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] NotaCreditoDtos.UpdateNotaCreditoDto data)
    {
        if (data.Id != id) return BadRequest("Invalid id");

        var json = DataConverters.SerializeObjectCustom<NotaCreditoDtos.UpdateNotaCreditoDto>(data);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await notaCreditoService.UpdateAsync(parameters));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await notaCreditoService.DeleteAsync(parameters));
    }
}
