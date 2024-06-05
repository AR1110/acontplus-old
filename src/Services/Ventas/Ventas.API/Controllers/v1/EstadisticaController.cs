namespace Ventas.API.Controllers.v1;

[ApiController]
[Route("api/[controller]")]
public class EstadisticaController : ControllerBase
{
    private readonly IConfiguration _configuration;
    

    public EstadisticaController(IConfiguration configuration)
    {
        _configuration = configuration;
        
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponse();
        try
        {
           
            await _db.SPExecute("Ventas.Estadisticas_Dashboard_Get");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
