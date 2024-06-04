namespace Inventario.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BodegaController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    private readonly ICustomLogger _log;

    public BodegaController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
        _db = new DbAccess(_configuration);
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Inventario.Bodega_Get");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on Get: \n" + ex);
            _response.Create("0", "Error al obtener las bodegas");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Inventario.Bodega_Insert");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on Post: \n" + ex);
            _response.Create("0", "Error al guardar la bodega");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Inventario.Bodega_Update");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on Put: \n" + ex);
            _response.Create("0", "Error al actualizar la bodega");
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
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Inventario.Bodega_Delete");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on Delete: \n" + ex);
            _response.Create("0", "Error al elimianr la bodega");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
