namespace FactElect.API.Controllers.DocElect.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class NotificacionTributariaController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public NotificacionTributariaController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
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
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al guardar las notificacion");

            _log.LogActivity("Error on post NotificacionTrib: \n" + ex);
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
