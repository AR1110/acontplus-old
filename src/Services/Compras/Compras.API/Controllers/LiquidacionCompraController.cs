namespace Compras.API.Controllers;

public class LiquidacionCompraController : BaseApiController
{
    private IConfiguration _configuration;
    private readonly ILiquidacionCompraService _liquidacionCompraSvc;

    public LiquidacionCompraController(IConfiguration configuration, ILiquidacionCompraService liquidacionCompraSvc
        )
    {
        _configuration = configuration;
        _liquidacionCompraSvc = liquidacionCompraSvc;

    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _liquidacionCompraSvc.GetAsync(new Dictionary<string, object>
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

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await _liquidacionCompraSvc.AddAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        try
        {
            var response =
                await _liquidacionCompraSvc.GetByIdAsync(
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
        try
        {
            var response = await _liquidacionCompraSvc.UpdateAsync(id, request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
            var response = await _liquidacionCompraSvc.DeleteAsync(parameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
