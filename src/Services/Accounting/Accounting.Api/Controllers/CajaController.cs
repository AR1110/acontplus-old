namespace Accounting.Api.Controllers;

public class CajaController(ICajaRepository cajaRepository) : BaseApiController
{
    private const string UserRoleIdClaim = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await cajaRepository.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateCajaDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateCajaDto>(data)) }
        };
        var response = await cajaRepository.AddAsync(parameters);
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateCajaWithAsignacionDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateCajaWithAsignacionDto>(data)) }
        };
        var response = await cajaRepository.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "id", id } };
        var response = await cajaRepository.DeleteAsync(parameters);
        return Ok(response);
    }
}
