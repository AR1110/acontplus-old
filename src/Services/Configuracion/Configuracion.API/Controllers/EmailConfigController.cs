namespace Configuracion.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmailConfigController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public EmailConfigController(IConfiguration configuration, ICustomLogger log)
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
            await _db.SPExecute("Config.EmailConfig_Get");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on Get Email-Config : \n" + ex);
            _response.Create("0", "Error al obtener los datos de la configuracion de email");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponseDeprecated>> Put(int id, [FromBody] ApiRequest parameters)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Config.EmailConfig_Update");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("idEmailConfig", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al actualizar");

            _log.LogActivity("Error on Put EmailConfig: \n" + ex);
        }
        finally
        {
            _db.Close();
        }

        return _response;
    }
}
