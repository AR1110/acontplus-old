namespace Compras.API.Controllers;

public class ProveedorController(IProveedorService _proveedorService) : BaseApiController
{


    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
            };

        return Ok(await _proveedorService.GetAsync(parameters));

    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        request.UserRoleId = User.GetClaimValue<int>("userRoleId");
        return Ok(await _proveedorService.AddAsync(request));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        request.UserRoleId = User.GetClaimValue<int>("userRoleId");
        return Ok(await _proveedorService.UpdateAsync(id, request));

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await _proveedorService.DeleteAsync(parameters));

    }
}
