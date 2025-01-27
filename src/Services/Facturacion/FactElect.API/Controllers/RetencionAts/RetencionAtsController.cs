using FactElect.API.Interfaces.RetencionAts;

namespace FactElect.API.Controllers.RetencionAts;

public class RetencionAtsController(IRetencionAtsService retencionAtsService) : BaseApiController
{
    [HttpGet("{json}")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await retencionAtsService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] RetencionAtsDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() },
            { "infoCompRet", SqlStringParam.Sanitize(data.infoCompRet) },
            { "docsSust", SqlStringParam.Sanitize(data.docsSust) },
            { "impuestos", SqlStringParam.Sanitize(data.impuestos) },
            { "retenciones", SqlStringParam.Sanitize(data.retenciones) }
        };

        // Add optional parameters only if they are not null or empty
        if (!string.IsNullOrEmpty(data.reembolsos))
        {
            parameters["reembolsos"] = SqlStringParam.Sanitize(data.reembolsos);
        }

        parameters["payments"] = SqlStringParam.Sanitize(data.payments);

        if (!string.IsNullOrEmpty(data.infoAdicional))
        {
            parameters["infoAdicional"] = SqlStringParam.Sanitize(data.infoAdicional);
        }

        return Ok(await retencionAtsService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, RetencionAtsDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "id", id }, { "json", SqlStringParam.Sanitize(data.infoCompRet) }
        };
        return Ok(await retencionAtsService.UpdateAsync(parameters));
    }

    [HttpPut("Cancel/{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id }, { "idRol", User.GetUserRoleId() } };
        return Ok(await retencionAtsService.CancelAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id }, { "idRol", User.GetUserRoleId() } };
        return Ok(await retencionAtsService.DeleteAsync(parameters));
    }
}
