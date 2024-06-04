namespace FactElect.API.Controllers.DocElect.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class NotificacionTributariaController : ControllerBase
{
    private readonly IConfiguration _configuration;
    

    public NotificacionTributariaController(IConfiguration configuration)
    {
        _configuration = configuration;
        
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("FactElect.Notificacion_Tributaria_Insert");
            _db.AddDynamicParam("idRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
