namespace Compras.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FacturaCompraController(IFacturaCompraService _svc) : ControllerBase
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

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        try
        {
            var response =
                await _svc.GetByIdAsync(new Dictionary<string, object>
                {
                    { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }
                });
            if (response == null) { return NoContent(); }

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            return BadRequest("Error on get by id: " + ex.Message);
        }
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
