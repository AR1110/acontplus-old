using Configuracion.API.Models;

namespace Configuracion.API.Controllers;

public class ImportacionController(IImportacionService importacionService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "json", SqlStringParam.Sanitize(json) } };
        return Ok(await importacionService.GetAsync(parameters));
    }

    [HttpPost("GetValidation/{codImportacion}")]
    public async Task<IActionResult> GetValidation(string codImportacion, [FromBody] ImportacionParams data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() },
            { "codImportacion", codImportacion },
            { "json", SqlStringParam.Sanitize(data.jsonParams) }
        };
        return Ok(await importacionService.ValidateAsync(parameters));
    }

    [HttpPost("{codImportacion}")]
    public async Task<IActionResult> Post(string codImportacion, [FromBody] ImportacionParams data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(data.jsonParams) }
        };
        return Ok(await importacionService.AddAsync(codImportacion, parameters));
    }
}
