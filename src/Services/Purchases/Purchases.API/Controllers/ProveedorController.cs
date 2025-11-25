namespace Purchases.Api.Controllers;

public class ProveedorController(IProveedorRepository _proveedorService) : BaseApiController
{
    private const string UserRoleClaimType = "userRoleId";

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
    public async Task<IActionResult> Post(ProveedorDto proveedorDto)
    {
        var parameters = new Dictionary<string, object>
      {
        { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<ProveedorDto>(proveedorDto)) }
      };
        return Ok(await _proveedorService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ProveedorDto proveedorDto)
    {
        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "id", id },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<ProveedorDto>(proveedorDto)) }
    };
        return Ok(await _proveedorService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "id", id }
    };
        return Ok(await _proveedorService.DeleteAsync(parameters));
    }
}
