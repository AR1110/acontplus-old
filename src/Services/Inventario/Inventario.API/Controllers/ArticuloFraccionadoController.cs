namespace Inventario.API.Controllers;

public class ArticuloFraccionadoController(IArticuloFraccionadoService articuloFraccionadoService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
            };
            var response = await articuloFraccionadoService.GetAsync(parameters);
            if (response == null) { return NoContent(); }

            return Ok(response);
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }


    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        request.UserRoleId = User.GetClaimValue<int>("userRoleId");
        var response = await articuloFraccionadoService.AddAsync(request);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {

        request.UserRoleId = User.GetClaimValue<int>("userRoleId");
        var response = await articuloFraccionadoService.UpdateAsync(id, request);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await articuloFraccionadoService.DeleteAsync(parameters);
        return Ok(response);

    }
}
