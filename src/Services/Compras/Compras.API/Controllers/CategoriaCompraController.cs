namespace Compras.API.Controllers;

public class CategoriaCompraController(ICategoriaCompraService categoriaCompraService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await categoriaCompraService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await categoriaCompraService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await categoriaCompraService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "id", User.GetUserRoleId() }
        };
        return Ok(await categoriaCompraService.DeleteAsync(parameters));
    }
}
