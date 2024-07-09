namespace Configuracion.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TipoDocumentoController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public TipoDocumentoController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("Config.TipoDocumento_Get");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar docs: \n" + ex);
            _response.Create("0", "Error al listar docs");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
