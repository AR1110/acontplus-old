namespace Inventory.Api.Controllers;

public class ArticuloCodigoBarraController(IArticuloCodigoBarraService articuloCodigoBarraService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await articuloCodigoBarraService.GetAsync(parameters);
        if (response == null) return NoContent();

        ;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateArticuloCodigoBarraDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateArticuloCodigoBarraDto>(dto)) }
    };
        var response = await articuloCodigoBarraService.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateArticuloCodigoBarraDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "id", id },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateArticuloCodigoBarraDto>(dto)) }
    };
        var response = await articuloCodigoBarraService.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await articuloCodigoBarraService.DeleteAsync(parameters);
        return Ok(response);
    }
}