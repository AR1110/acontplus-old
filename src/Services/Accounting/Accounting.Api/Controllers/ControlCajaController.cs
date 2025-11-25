namespace Accounting.Api.Controllers;

public class ControlCajaController(IControlCajaRepository controlCajaRepository) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await controlCajaRepository.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }


    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateControlCajaDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateControlCajaDto>(data)) }
        };
        var response = await controlCajaRepository.AddAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateControlCajaDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateControlCajaDto>(data)) }
        };
        var response = await controlCajaRepository.UpdateAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }
}
