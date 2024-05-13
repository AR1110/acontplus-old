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
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _db.SPExecute("Recepcion.Doc_Detail_Temp_Get");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("idDocumento", idDocumento);
            _db.AddDynamicParam("jsonData", "");
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al obtener los detalles temporales: " + ex);
            _response.Create("0", "Error al obtener los detalles temporales");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _db.SPExecute("Recepcion.Doc_Detail_Temp_Insert");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("jsonData",
                SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al insertar el detalle temporal: " + ex);
            _response.Create("0", "Error al insertar el detalle");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] ApiRequest parameters)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _db.SPExecute("Recepcion.Doc_Detail_Temp_Update");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("jsonData",
                SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al actualizar el detalle temporal: " + ex);
            _response.Create("0", "Error al actualizar el detalle");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
