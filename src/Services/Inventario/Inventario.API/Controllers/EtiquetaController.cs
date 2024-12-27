using Common.AppSettings.Extensions;

namespace Inventario.API.Controllers;

public class EtiquetaController(IEtiquetaService etiquetaService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await etiquetaService.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };

        var response = await etiquetaService.AddAsync(parameters);

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
             { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
              { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };

        var response = await etiquetaService.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
        };

        var response = await etiquetaService.DeleteAsync(parameters);
        return Ok(response);
    }
}
