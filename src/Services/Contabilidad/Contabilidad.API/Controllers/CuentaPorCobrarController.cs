namespace Contabilidad.API.Controllers;

public class CuentaPorCobrarController(ICuentaPorCobrarService cuentaPorCobrarService, IConfiguration configuration)
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

    [HttpPost("Insert/Cuota")]
    public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
    {
        var dbAccess = new DbAccess(configuration);
        var response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await dbAccess.SpExecuteAsync("Contabilidad.CuotaPorCobrar_Insert");
            dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            dbAccess.AddDynamicParam("json", DataConverters.SerializeDictionary(paremeter.Data));
            response = await dbAccess.GetDefaultAsync();
        }
        finally
        {
            dbAccess.Close();
        }

        return Ok(response);
    }

    [HttpPut("Update/Cuota")]
    public async Task<IActionResult> Update([FromBody] ApiRequest paremeter)
    {
        var dbAccess = new DbAccess(configuration);
        var response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await dbAccess.SpExecuteAsync("Contabilidad.CuotaPorCobrar_Update");
            dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            dbAccess.AddDynamicParam("json", DataConverters.SerializeDictionary(paremeter.Data));
            response = await dbAccess.GetDefaultAsync();
        }
        finally
        {
            dbAccess.Close();
        }

        return Ok(response);
    }
}
