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
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
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
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await articuloFraccionadoService.AddAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        try
        {
            request.UserRoleId = User.GetUserRoleId();
            var response = await articuloFraccionadoService.UpdateAsync(id, request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
            var response = await articuloFraccionadoService.DeleteAsync(parameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
