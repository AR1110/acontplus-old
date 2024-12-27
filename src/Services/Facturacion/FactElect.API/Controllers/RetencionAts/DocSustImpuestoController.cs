using Common.AppSettings.Extensions;
using FactElect.API.Services.RetencionAts;

namespace FactElect.API.Controllers.RetencionAts;

public class DocSustImpuestoController(IDocSustImpuestoService docSustImpuestoService) : BaseApiController
{
    [HttpPost("{idDocSust}")]
    public async Task<IActionResult> Post(int idDocSust, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "idDocSust", idDocSust },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await docSustImpuestoService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "id", id }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await docSustImpuestoService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "id", id } };
        return Ok(await docSustImpuestoService.DeleteAsync(parameters));
    }
}
