namespace Inventory.Api.Controllers;

public class ArticuloFraccionadoController(IArticuloFraccionadoService articuloFraccionadoService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var parameters = new Dictionary<string, object>
      {
          { "userRoleId", User.GetClaimValue<int>("userRoleId") },
          { "json", SqlStringParam.Sanitize(json) }
      };
            var response = await articuloFraccionadoService.GetAsync(parameters);
            return response == null ? NoContent() : Ok(response);
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(CreateArticuloFraccionadoDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateArticuloFraccionadoDto>(dto)) }
    };
        return Ok(await articuloFraccionadoService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, UpdateArticuloFraccionadoDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "id", id },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateArticuloFraccionadoDto>(dto)) }
    };
        return Ok(await articuloFraccionadoService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await articuloFraccionadoService.DeleteAsync(parameters);
        return Ok(response);
    }
}