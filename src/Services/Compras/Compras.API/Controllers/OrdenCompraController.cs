namespace Compras.API.Controllers;

public class OrdenCompraController(IOrdenCompraService _svc) : BaseApiController
{

    [HttpGet()]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _svc.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);

    }

    [HttpPost()]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();

        var response = await _svc.AddAsync(request);
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var response = await _svc.GetByIdAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "id", id }
            });
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        var response = await _svc.UpdateAsync(id, request);
        return Ok(response);

    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        var response = await _svc.DeleteAsync(parameters);
        return Ok(response);
    }
}
