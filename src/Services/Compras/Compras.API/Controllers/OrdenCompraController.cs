namespace Compras.API.Controllers;

public class OrdenCompraController : BaseApiController
{
    private IConfiguration _configuration;
    private readonly IOrdenCompraService _ordeCompraSvc;

    public OrdenCompraController(IConfiguration configuration, IOrdenCompraService ordeCompraSvc)
    {
        _configuration = configuration;
        _ordeCompraSvc = ordeCompraSvc;

    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _ordeCompraSvc.GetAsync(new Dictionary<string, object>
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
            var response = await _ordeCompraSvc.AddAsync(request);
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
                await _ordeCompraSvc.GetByIdAsync(new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() }, { "id", id }
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
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await _ordeCompraSvc.UpdateAsync(id, request);
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
            var response = await _ordeCompraSvc.DeleteAsync(parameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
