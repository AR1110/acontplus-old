namespace Contabilidad.API.Controllers;

public class CajaController(ICajaService cajaService) : BaseApiController
{
    private const string UserRoleIdClaim = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await cajaService.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await cajaService.AddAsync(parameters);
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await cajaService.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "id", id } };
        var response = await cajaService.DeleteAsync(parameters);
        return Ok(response);
    }
}