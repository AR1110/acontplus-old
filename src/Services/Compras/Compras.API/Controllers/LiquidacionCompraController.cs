namespace Compras.API.Controllers;

public class LiquidacionCompraController(ILiquidacionCompraService _svc) : BaseApiController
{ 

    [HttpGet()]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _svc.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
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
        request.UserRoleId = User.GetUserRoleId(); 
            return Ok(await _svc.AddAsync(request)); 
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        try
        {
            var response =
                await _svc.GetByIdAsync(
                    new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } });
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
        request.UserRoleId = User.GetUserRoleId(); 
        return Ok(await _svc.UpdateAsync(id, request));
        
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    { 
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } }; 
        return Ok(await _svc.DeleteAsync(parameters)); 
    }
}
