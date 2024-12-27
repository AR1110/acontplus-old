using Common.AppSettings.Extensions;

namespace Compras.API.Controllers;

public class DocRecDetailTempController(
    IDocRecDetailTempService detailTempService) : BaseApiController
{
    [HttpGet("{idDocumento}")]
    public async Task<IActionResult> GetId(int idDocumento)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() }, { "idDocumento", idDocumento }, { "jsonData", "" }
        };
        return Ok(await detailTempService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() },
            { "jsonData", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Ok(await detailTempService.AddAsync(parameters));
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() },
            { "jsonData", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Ok(await detailTempService.UpdateAsync(parameters));
    }
}
