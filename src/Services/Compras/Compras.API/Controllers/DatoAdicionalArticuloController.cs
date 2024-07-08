namespace Compras.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DatoAdicionalArticuloController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public DatoAdicionalArticuloController(IConfiguration configuration, ICustomLogger log)
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
            await _db.SPExecute("Recepcion.Dato_Adicional_Articulo_Get");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar Familias: \n" + ex);
            _response.Create("0", "Error al listar Familias");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Insert/{id}")]
    public async Task<IActionResult> Insert(int id, ApiRequest request)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Recepcion.Dato_Adicional_Articulo_Insert");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("idDocumento", id);
            _db.AddDynamicParam("json", DataConverters.SerializeDictionary(request.Data));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al insertar dato adicional articulo: \n" + ex);
            _response.Create("0", "Error al insertar dato adicional articulo");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpDelete("Delete/{idInfoAdicional}")]
    public async Task<IActionResult> Delete(int idInfoAdicional)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Recepcion.Dato_Adicional_Articulo_Delete");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("idInfoAdicional", idInfoAdicional);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al eliminar dato adicional articulo: \n" + ex);
            _response.Create("0", "Error al dato adicional articulo");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
