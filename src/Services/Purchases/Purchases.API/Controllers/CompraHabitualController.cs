namespace Purchases.Api.Controllers;

public class CompraHabitualController(
    ICompraHabitualRepository compraHabitualService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await compraHabitualService.GetAsync(parameters));
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Post([FromBody] CompraHabitualDto compraHabitualDto)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CompraHabitualDto>(compraHabitualDto)) }
    };
        return Ok(await compraHabitualService.AddAsync(parameters));
    }

    [HttpPut("Put")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await compraHabitualService.UpdateAsync(parameters));
    }

    [HttpDelete("Delete")]
    public async Task<IActionResult> Delete(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await compraHabitualService.DeleteAsync(parameters));
    }
}
