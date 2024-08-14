namespace Compras.API.Controllers;

public class CompraHabitualController(
    ICompraHabitualService compraHabitualService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await compraHabitualService.GetAsync(parameters));
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Ok(await compraHabitualService.AddAsync(parameters));
    }

    [HttpPut("Put")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "id", id }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await compraHabitualService.UpdateAsync(parameters));
    }

    [HttpDelete("Delete")]
    public async Task<IActionResult> Delete(string json)
    {
        var parameters = new Dictionary<string, object> {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await compraHabitualService.DeleteAsync(parameters));
    }
}
