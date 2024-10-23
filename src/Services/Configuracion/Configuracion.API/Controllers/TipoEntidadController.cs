namespace Configuracion.API.Controllers;

public class TipoEntidadController : BaseApiController
{
    public readonly IConfiguration _configuration;

    public TipoEntidadController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Config.TipoEntidad_Get");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", json);
            _response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al listar tipo entidad");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(string json)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Config.TipoEntidad_Insert");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", json);
            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al crear tipo entidad");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, string json)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Config.TipoEntidad_Update");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", json);

            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al actualizar tipo entidad");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Config.TipoEntidad_Delete");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);

            _response = await _db.GetDefaultAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al eliminar tipo entidad");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    //Definir correctamente mas adelante
    [HttpGet("ListForSelect")]
    public async Task<IActionResult> ListForSelect(int id)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Config.TipoEntidad_For_Select");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al lista tipo entidad para el formulario");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
