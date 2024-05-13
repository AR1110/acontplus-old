namespace Contabilidad.API.Controllers.v1;

[ApiController]
[Route("api/CuentaPorCobrar/")]
[ApiVersion("1.0")]
public class CuentaPorCobrarController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    private readonly ICuentaPorCobrarService _service;

    public CuentaPorCobrarController(ICuentaPorCobrarService service, IConfiguration configuration)
    {
        _service = service;
        _configuration = configuration;
        _db = new DbAccess(configuration);
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _service.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }

    [HttpPost("Insert/Cuota")]
    public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
    {
        var _dbAccess = new DbAccess(_configuration);
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.CuotaPorCobrar_Insert");
            _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _dbAccess.AddDynamicParam("json", DataConverters.SerializeDictionary(paremeter.Data));
            _response = _dbAccess.GetDefault();
        }
        finally
        {
            _dbAccess.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/Cuota")]
    public async Task<IActionResult> Update([FromBody] ApiRequest paremeter)
    {
        var _dbAccess = new DbAccess(_configuration);
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.CuotaPorCobrar_Update");
            _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _dbAccess.AddDynamicParam("json", DataConverters.SerializeDictionary(paremeter.Data));
            _response = _dbAccess.GetDefault();
        }
        finally
        {
            _dbAccess.Close();
        }

        return Ok(_response);
    }
}
