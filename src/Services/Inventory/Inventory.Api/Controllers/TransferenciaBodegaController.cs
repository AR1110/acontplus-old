namespace Inventory.Api.Controllers;

public class TransferenciaBodegaController(ITransferenciaBodegaService transferenciaBodegaService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await transferenciaBodegaService.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id }
        };
        var response = await transferenciaBodegaService.GetIdAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateTransferenciaBodegaDto dto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateTransferenciaBodegaDto>(dto)) }
        };

        var response = await transferenciaBodegaService.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateTransferenciaBodegaDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest("ID in URL does not match ID in request body");
        }

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateTransferenciaBodegaDto>(dto)) }
        };

        var response = await transferenciaBodegaService.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id }
        };

        var response = await transferenciaBodegaService.DeleteAsync(parameters);
        return Ok(response);
    }
}