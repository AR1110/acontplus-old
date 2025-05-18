namespace Inventario.API.Controllers;

public class TransferenciaBodegaController(ITransferenciaBodegaService transferenciaBodegaService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await transferenciaBodegaService.GetAsync(parameters);
        if (response == null) return NoContent();

        ;
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await transferenciaBodegaService.GetIdAsync(parameters);
        if (response == null) return NoContent();

        ;
        return Ok(response);
    }


    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeDictionary(data.Data) }
        };

        var response = await transferenciaBodegaService.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await transferenciaBodegaService.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await transferenciaBodegaService.DeleteAsync(parameters);
        return Ok(response);
    }
}