namespace Accounting.Api.Controllers;

public class SubEntidadFinancieraController(ISubEntidadFinancieraRepository subEntidadFinancieraService)
    : BaseApiController
{
    private const string UserRoleIdClaim = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await subEntidadFinancieraService.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateSubEntidadFinancieraDto data)
    {
        var fromMobile = HttpContext.Items["FromMobile"] as bool? ?? false;

        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateSubEntidadFinancieraDto>(data)) },
            { "fromMobile", fromMobile }
        };
        var response = await subEntidadFinancieraService.AddAsync(parameters);
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateSubEntidadFinancieraDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateSubEntidadFinancieraDto>(data)) }
        };
        var response = await subEntidadFinancieraService.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "id", id } };
        var response = await subEntidadFinancieraService.DeleteAsync(parameters);
        return Ok(response);
    }
}
