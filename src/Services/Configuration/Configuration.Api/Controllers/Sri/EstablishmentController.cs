
namespace Configuration.Api.Controllers.Sri;

public class EstablishmentController(IEstablishmentService service) : BaseApiController
{

    private const string UserRoleClaimType = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
    {
        { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
        { "json", SqlStringParam.Sanitize(json) }
    };
        var response = await service.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(EstablishmentDto data)
    {
        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<EstablishmentDto>(data)) },
      { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
    };
        return Ok(await service.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, EstablishmentDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "id", id },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<EstablishmentDto>(dto)) }
    };
        return Ok(await service.UpdateAsync(parameters));
    }

    [HttpPut("PutSriAuth/{id}/{autoSriAuth}")]
    public async Task<IActionResult> PutSriAuth(int id, bool autoSriAuth)
    {
        var parameters = new Dictionary<string, object> { { "id", id }, { "autoSriAuth", autoSriAuth } };
        return Ok(await service.PutSriAuth(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await service.DeleteAsync(parameters);
        return Ok(response);
    }
}