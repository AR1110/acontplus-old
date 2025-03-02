namespace FactElect.API.Controllers.RetencionAts;

public class DocSustPagoController(IDocSustPagoService docSustPagoService) : BaseApiController
{
    [HttpPost("{idDocSust}")]
    public async Task<IActionResult> Post(int idDocSust, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "idDocSust", idDocSust },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await docSustPagoService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await docSustPagoService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await docSustPagoService.DeleteAsync(parameters));
    }
}
