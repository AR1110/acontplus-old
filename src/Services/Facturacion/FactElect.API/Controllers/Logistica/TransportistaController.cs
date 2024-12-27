using Common.AppSettings.Extensions;
using FactElect.API.Models;
using FactElect.API.Services.Logistica;

namespace FactElect.API.Controllers.Logistica;

public class TransportistaController(ITransportistaService transportistaService) : BaseApiController
{
    /*
     const json = {
        typeList: 0, --Lista Normal
        typeList: 1 => Para lISTAR EN SELECT HTML
        typeList: 2 => Para buscadores(autocomplete)
    }
     */
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await transportistaService.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] Transportista data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "idTipoIdentificacion", data.idTipoIdentificacion },
            { "nroIdentificacion", data.nroIdentificacion },
            { "nombre", data.nombre }
        };
        return Ok(await transportistaService.AddAsync(parameters));
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Transportista data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "id", id },
            { "nroIdentificacion", data.nroIdentificacion },
            { "nombre", data.nombre }
        };
        return Ok(await transportistaService.UpdateAsync(parameters));
    }

    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "id", id } };
        return Ok(await transportistaService.DeleteAsync(parameters));
    }
}
