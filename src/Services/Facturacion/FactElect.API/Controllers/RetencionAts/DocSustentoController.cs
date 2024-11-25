using FactElect.API.Services.RetencionAts;

namespace FactElect.API.Controllers.RetencionAts;

public class DocSustentoController(IDocSustentoService docSustentoService) : BaseApiController
{
    [HttpPost("{idRetencionAts}")]
    public async Task<IActionResult> Post(int idRetencionAts, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "idRetencionAts", idRetencionAts },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await docSustentoService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "id", id }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await docSustentoService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "id", id } };
        return Ok(await docSustentoService.DeleteAsync(parameters));
    }
}
