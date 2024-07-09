namespace Configuracion.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsuarioController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    private readonly ICustomLogger _log;

    public UsuarioController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
        _log = log;
    }

    [HttpGet("{json}")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("App.Usuario_Get");
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while getting users: \n" + ex);
            _response.Create("0", "Error getting users");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("App.Usuario_Search");
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while searching users: \n" + ex);
            _response.Create("0", "Error searching users");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpPost("{json}")]
    public async Task<IActionResult> Post(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("App.Usuario_Insert");
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while insert users: \n" + ex);
            _response.Create("0", "Error insert users");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("{id}/{json}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SpExecuteAsync("App.Usuario_Update");
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while updating users: \n" + ex);
            _response.Create("0", "Error updating users");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("App.Usuario_Delete");
            _db.AddDynamicParam("id", id);
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while deleting users: \n" + ex);
            _response.Create("0", "Error deleting users");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
