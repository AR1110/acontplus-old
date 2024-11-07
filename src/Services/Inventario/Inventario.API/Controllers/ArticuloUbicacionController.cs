namespace Inventario.API.Controllers;

public class ArticuloUbicacionController(IArticuloUbicacionService articuloUbicacionService) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Insert(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await articuloUbicacionService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "id", id }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await articuloUbicacionService.UpdateAsync(parameters));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        return Ok(await articuloUbicacionService.DeleteAsync(parameters));
    }
}
