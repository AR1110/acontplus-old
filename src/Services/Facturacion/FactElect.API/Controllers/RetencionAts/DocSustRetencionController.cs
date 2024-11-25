using FactElect.API.Services.RetencionAts;

namespace FactElect.API.Controllers.RetencionAts;

public class DocSustRetencionController(IDocSustRetencionService docSustRetencionService) : BaseApiController
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
        return Ok(await docSustRetencionService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "id", id }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await docSustRetencionService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "id", id } };
        return Ok(await docSustRetencionService.DeleteAsync(parameters));
    }
}
