namespace Contabilidad.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class ComprobanteIngresoController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _dbAccess;

    public ComprobanteIngresoController(IConfiguration configuration)
    {
        _configuration = configuration;
        _dbAccess = new DbAccess(_configuration);
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Get");
        _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
        _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(json));
        _response = _dbAccess.GetDataSetAsync();
        _dbAccess.Dispose();
        return Ok(_response);
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
    {
        var _response = new ApiResponseDeprecated();
        var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Insert");
        _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
        _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(paremeter.Data)));
        _response = _dbAccess.GetDefault();
        _dbAccess.Dispose();
        return Ok(_response);
    }

    [HttpPut("Cancel")]
    public async Task<IActionResult> Cancel([FromBody] ApiRequest paremeter)
    {
        var _response = new ApiResponseDeprecated();
        var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Update_Cancel");
        _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
        _dbAccess.AddDynamicParam("json", DataConverters.SerializeDictionary(paremeter.Data));
        _response = _dbAccess.GetDefault();
        _dbAccess.Dispose();
        return Ok(_response);
    }
}
