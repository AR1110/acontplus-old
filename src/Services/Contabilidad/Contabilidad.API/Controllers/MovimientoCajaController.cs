using Common.AppSettings.Extensions;

namespace Contabilidad.API.Controllers;

public class MovimientoCajaController(IMovimientoCajaService movimientoCajaService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var response = await movimientoCajaService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        });
        if (response == null) { return NoContent(); }

        ;
        return Ok(new { code = "1", payload = response });
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };

        var response = await movimientoCajaService.AddAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        var response = await movimientoCajaService.DeleteAsync(parameters);
        return Ok(response);
    }
}
