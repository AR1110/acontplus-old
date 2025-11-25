namespace Inventory.Api.Controllers;

public class EtiquetaController(IEtiquetaService etiquetaService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await etiquetaService.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateEtiquetaDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateEtiquetaDto>(dto)) },
      { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
    };
        return Ok(await etiquetaService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateEtiquetaDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "id", id },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateEtiquetaDto>(dto)) },
        { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
    };

        return Ok(await etiquetaService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id }
        };

        return Ok(await etiquetaService.DeleteAsync(parameters));
    }
}