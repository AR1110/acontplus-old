namespace Inventory.Api.Controllers;

public class ConsolidacionController(IConsolidacionService consolidacionService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await consolidacionService.GetAsync(parameters);
        if (response == null) return NoContent();

        ;
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await consolidacionService.GetIdAsync(parameters);
        if (response == null) return NoContent();

        ;
        return Ok(response);
    }


    [HttpPost]
    public async Task<IActionResult> Post(CreateConsolidacionDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateConsolidacionDto>(dto)) }
    };
        return Ok(await consolidacionService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateConsolidacionDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "id", id },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateConsolidacionDto>(dto)) }
    };
        return Ok(await consolidacionService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await consolidacionService.DeleteAsync(parameters);
        return Ok(response);
    }


    [HttpPost("Importacion")]
    public async Task<IActionResult> Importacion(CreateConsolidacionDto dto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", System.Text.Json.JsonSerializer.Serialize(dto) }
        };

        var response = await consolidacionService.GetAsync(parameters);
        return Ok(response);
    }
}