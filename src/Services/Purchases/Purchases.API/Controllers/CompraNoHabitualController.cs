namespace Purchases.Api.Controllers;

public class CompraNoHabitualController(ICompraNoHabitualRepository _svc) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _svc.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
            });
            if (response == null) return NoContent();

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            return BadRequest("Error on get: " + ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Insert(CompraNoHabitualDto compraNoHabitualDto)
    {
        var parameters = new Dictionary<string, object>
      {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CompraNoHabitualDto>(compraNoHabitualDto)) }
      };
        return Ok(await _svc.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, CompraNoHabitualDto compraNoHabitualDto)
    {
        var parameters = new Dictionary<string, object>
      {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "id", id },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CompraNoHabitualDto>(compraNoHabitualDto)) }
      };
        return Ok(await _svc.UpdateAsync(parameters));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };

        return Ok(await _svc.DeleteAsync(parameters));
    }
}
