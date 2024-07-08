namespace Compras.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class Doc_Rec_DetailTempController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    private readonly ICustomLogger _log;

    public Doc_Rec_DetailTempController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _db = new DbAccess(configuration);
        _log = log;
    }

    [HttpGet("{idDocumento}")]
    public async Task<IActionResult> GetId(int idDocumento)
    {
        var response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Recepcion.Doc_Detail_Temp_Get");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("idDocumento", idDocumento);
            _db.AddDynamicParam("jsonData", "");
            response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al obtener los detalles temporales: " + ex);
            response.Create("0", "Error al obtener los detalles temporales");
        }
        finally
        {
            _db.Close();
        }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
    {
        var response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Recepcion.Doc_Detail_Temp_Insert");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("jsonData",
                SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al insertar el detalle temporal: " + ex);
            response.Create("0", "Error al insertar el detalle");
        }
        finally
        {
            _db.Close();
        }

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] ApiRequest parameters)
    {
        var response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Recepcion.Doc_Detail_Temp_Update");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("jsonData",
                SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al actualizar el detalle temporal: " + ex);
            response.Create("0", "Error al actualizar el detalle");
        }
        finally
        {
            _db.Close();
        }

        return Ok(response);
    }
}
