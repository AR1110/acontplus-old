namespace Configuracion.API.Controllers;

public class SolicitudController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;

    public SolicitudController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
    }

    [HttpGet("Get/{json}")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("Config.Solicitud_Get");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al obtener datos de solicitud");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Post/{json}")]
    public async Task<IActionResult> Post(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("Config.Solicitud_Insert");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al insertar datos de solicitud");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Put/{json}")]
    public async Task<IActionResult> Put(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("Config.Solicitud_Update");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al actualizar datos de solicitud");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpDelete("Delete/{json}")]
    public async Task<IActionResult> Delete(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("Config.Solicitud_Update");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al verificar datos de solicitud");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("Check/{json}")]
    public async Task<IActionResult> Check(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("Config.Solicitud_Get");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al verificar datos de solicitud");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
