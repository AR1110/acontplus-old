namespace Billing.Api.Controllers.Logistica;

public class GuiaRemisionController(IGuiaRemisionService service) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.GetAsync(parameters);
        if (response == null) return NoContent();

        ;
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await service.GetByIdAsync(parameters);
        if (response == null) return NoContent();

        ;
        return Ok(new { code = "1", payload = response });
    }

    [HttpPost]
    public async Task<IActionResult> Post(GuiaRemisionDtos.CreateGuiaRemisionDto data)
    {
        var json = DataConverters.SerializeObjectCustom<GuiaRemisionDtos.CreateGuiaRemisionDto>(data);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.AddAsync(parameters);
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, GuiaRemisionDtos.UpdateGuiaRemisionDto data)
    {
        if (data.Id != id) return BadRequest("Invalid id");

        var json = DataConverters.SerializeObjectCustom<GuiaRemisionDtos.UpdateGuiaRemisionDto>(data);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.UpdateAsync(parameters);
        return Ok(response);
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
