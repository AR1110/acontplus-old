namespace Configuration.Api.Controllers.Sri;

public class EstabAsigController(IEstablecimientoAsignacionService establecimientoAsignacionService) : BaseApiController
{
    private const string UserRoleClaimType = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
        { "json", json }
    };
        var response = await establecimientoAsignacionService.GetAsync(parameters);
        return Ok(response);
    }

    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm(string json)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
      { "json", json }
    };
        return Ok(await establecimientoAsignacionService.GetDataFormAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] EstablishmentDto data)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
      { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<EstablishmentDto>(data)) },
    };
        return Ok(await establecimientoAsignacionService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await establecimientoAsignacionService.UpdateAsync(parameters);
        return Ok(response);
    }
}
