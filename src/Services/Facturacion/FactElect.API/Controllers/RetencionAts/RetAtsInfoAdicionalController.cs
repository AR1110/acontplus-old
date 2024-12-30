using Common.AppSettings.Extensions;
using FactElect.API.Interfaces.RetencionAts;

namespace FactElect.API.Controllers.RetencionAts;

public class RetAtsInfoAdicionalController(IRetAtsInfoAdicionalService retAtsInfoAdicionalService) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await retAtsInfoAdicionalService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await retAtsInfoAdicionalService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "id", id },
        };
        return Ok(await retAtsInfoAdicionalService.DeleteAsync(parameters));
    }
}
