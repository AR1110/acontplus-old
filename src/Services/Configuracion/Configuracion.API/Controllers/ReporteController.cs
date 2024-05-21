namespace Configuracion.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReporteController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    private readonly ICustomLogger _log;

    public ReporteController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
        _log = log;
    }

    [HttpGet("Get/{json}")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Config.Reporte_Get");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while getting reports: \n" + ex);
            _response.Create("0", "Error getting reports");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Post([FromBody] ReporteDto data)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Config.Reporte_Insert");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("codigo", data.codigo);
            _db.AddDynamicParam("reportPath", data.reportPath);
            _db.AddDynamicParam("contentType", data.contentType);
            _db.AddDynamicParam("storedProcedure", data.storedProcedure);
            _db.AddDynamicParam("nombreReporte", data.nombreReporte);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while insert report: \n" + ex);
            _response.Create("0", "Error al insertar el reporte");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Put/{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ReporteDto data)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Config.Reporte_Update");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("codigo", data.codigo);
            _db.AddDynamicParam("reportPath", data.reportPath);
            _db.AddDynamicParam("contentType", data.contentType);
            _db.AddDynamicParam("storedProcedure", data.storedProcedure);
            _db.AddDynamicParam("nombreReporte", data.nombreReporte);
            _db.AddDynamicParam("estado", data.estado);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while updating report: \n" + ex);
            _response.Create("0", "Error al actualizar el reporte");
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
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Config.Reporte_Delete");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error while deleting report: \n" + ex);
            _response.Create("0", "Error al eliminar el reporte");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
