namespace Contabilidad.API.Controllers;

public class MovimientoCajaController(IMovimientoCajaService movimientoCajaService) : BaseApiController
{
    private const string UserRoleIdClaim = "userRoleId";

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var response = await movimientoCajaService.GetAsync(new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };

        var response = await movimientoCajaService.AddAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "id", id } };
        var response = await movimientoCajaService.DeleteAsync(parameters);
        return Ok(response);
    }
}