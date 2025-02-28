namespace Compras.API.Controllers;

public class CompraNoHabitualController(ICompraNoHabitualService _svc) : BaseApiController
{

    [HttpGet()]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _svc.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
            });
            if (response == null) { return NoContent(); }

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            return BadRequest("Error on get: " + ex.Message);
        }
    }

    [HttpPost()]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        request.UserRoleId = User.GetClaimValue<int>("userRoleId");
        return Ok(await _svc.AddAsync(request));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        request.UserRoleId = User.GetClaimValue<int>("userRoleId");
        return Ok(await _svc.UpdateAsync(id, request));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };

        return Ok(await _svc.DeleteAsync(parameters));
    }
}
