namespace Inventario.API.Controllers;

public class BodegaController : BaseApiController
{
    private readonly IBodegaService _service;

    public BodegaController(IBodegaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }
        };

        var response = await _service.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "json",  SqlStringParam.Sanitize(json) }
        };

        var response = await _service.AddAsync(parameters);

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "id", id },
            { "json",  SqlStringParam.Sanitize(json) }
        };

        var response = await _service.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "id", id },
        };

        var response = await _service.DeleteAsync(parameters);
        return Ok(response);
    }
}
