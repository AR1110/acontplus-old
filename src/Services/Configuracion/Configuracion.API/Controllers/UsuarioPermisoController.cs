namespace Configuracion.API.Controllers;

public class UsuarioPermisoController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    public UsuarioPermisoController(IConfiguration configuration)
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
            await _db.SpExecuteAsync("Config.UserPermission_Get");
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error getting user permission");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] UsuarioPemisoDto data)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("Config.UserPermission_Update");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("jsonPermission", SqlStringParam.Sanitize(data.jsonPermission));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error updating user permission");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpGet("CheckHasPermission/{json}")]
    public async Task<IActionResult> CheckHasPermission(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("Config.UserPermission_CheckHasPermission");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error while checking permission user");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
