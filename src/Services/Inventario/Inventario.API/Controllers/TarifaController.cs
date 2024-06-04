namespace Inventario.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TarifaController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public TarifaController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Tarifa_Get");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar tarifas: \n" + ex);
            _response.Create("0", "Error al listar tarifas");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] Tarifa data)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Tarifa_Insert");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("descripcion", data.descripcion);
            _db.AddDynamicParam("codigo", data.codigo);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al insertar tarifa: \n" + ex);
            _response.Create("0", "Error al insertar tarifa");
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
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Tarifa_Update");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al actualizar tarifa: \n" + ex);
            _response.Create("0", "Error al actualizar tarifa");
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
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Tarifa_Delete");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al eliminar medida: \n" + ex);
            _response.Create("0", "Error al eliminar medida");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("ListForSelect")]
    public async Task<IActionResult> ListForSelect(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Tarifa_For_Select");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar tarifas para Select: \n" + ex);
            _response.Create("0", "Error al listar tarifas para Select");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
