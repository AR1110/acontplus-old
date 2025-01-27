namespace Contabilidad.API.Controllers;

public class CuentaPorCobrarController(ICuentaPorCobrarService cuentaPorCobrarService)
    : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await cuentaPorCobrarService.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }

    // este sp trasladar a Controlador CuotaPorCobrarController y el servicio respectivamente
    [HttpPost("Insert/Cuota")]
    public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "json", DataConverters.SerializeDictionary(paremeter.Data) }
        };
        return Ok(await cuentaPorCobrarService.AddAsync(parameters));
    }

    [HttpPut("Update/Cuota")]
    public async Task<IActionResult> Update([FromBody] ApiRequest paremeter)
    {

        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "json", DataConverters.SerializeDictionary(paremeter.Data) }
        };
        return Ok(await cuentaPorCobrarService.UpdateAsync(parameters));
    }
}
