namespace Accounting.Api.Controllers;

public class MovimientoCajaController(IMovimientoCajaRepository movimientoCajaRepository) : BaseApiController
{
    private const string UserRoleIdClaim = "userRoleId";

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var response = await movimientoCajaRepository.GetAsync(new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(CreateMovimientoCajaDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "json", DataConverters.SerializeObjectCustom<CreateMovimientoCajaDto>(request) }
        };

        var response = await movimientoCajaRepository.AddAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "id", id } };
        var response = await movimientoCajaRepository.DeleteAsync(parameters);
        return Ok(response);
    }
}
