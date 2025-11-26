namespace Purchases.Api.Controllers;

public class OrdenCompraController(IOrdenCompraRepository _svc) : BaseApiController
{
    private const string UserRoleClaimType = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _svc.GetAsync(new Dictionary<string, object>
      {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(json) }
      }
        );
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var response = await _svc.GetByIdAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }
        });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Insert(OrdenCompraDto ordenCompraDto)
    {
        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<OrdenCompraDto>(ordenCompraDto)) }
    };
        var response = await _svc.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, OrdenCompraDto ordenCompraDto)
    {
        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "id", id },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<OrdenCompraDto>(ordenCompraDto)) }
    };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await _svc.DeleteAsync(parameters);
        return Ok(response);
    }
}