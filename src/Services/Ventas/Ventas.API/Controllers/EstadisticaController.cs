namespace Ventas.API.Controllers.v1;

[ApiController]
[Route("api/[controller]")]
public class EstadisticaController(IConfiguration configuration) : ControllerBase
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var db = new DbAccess(configuration);
        var _response = new ApiResponseDeprecated();
        try
        {

            await db.SPExecute("Ventas.Estadisticas_Dashboard_Get");
            db.AddDynamicParam("idRol", User.GetUserRoleId());
            db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = db.GetDataTableAsync();
        }
        finally
        {
            db.Close();
        }

        return Ok(_response);
    }
}
