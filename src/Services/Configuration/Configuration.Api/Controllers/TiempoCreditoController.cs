namespace Configuration.Api.Controllers;

public class TiempoCreditoController(ITiempoCreditoService tiempoCreditoService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await tiempoCreditoService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var fromMobile = HttpContext.Items["FromMobile"] as bool? ?? false;

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) },
            { "fromMobile", fromMobile }
        };
        return Ok(await tiempoCreditoService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await tiempoCreditoService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await tiempoCreditoService.DeleteAsync(parameters));
    }
}
