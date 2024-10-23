namespace Configuracion.API.Controllers;

public class TipoDocumentoController : BaseApiController
{
    private readonly IConfiguration _configuration; 

    public TipoDocumentoController(IConfiguration configuration)
    {
        _configuration = configuration;
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
            _response.Create("0", "Error al listar docs");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
