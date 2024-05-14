namespace Contabilidad.API.Controllers.v1;

[Route("api/[controller]")]
[ApiController]
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
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Get");
            _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _dbAccess.GetDataSetAsync();
        }
        finally
        {
            _dbAccess.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Insert");
            _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _dbAccess.AddDynamicParam("json",
                SqlStringParam.Sanitize(DataConverters.SerializeDictionary(paremeter.Data)));
            _response = _dbAccess.GetDefault();
        }
        finally
        {
            _dbAccess.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Cancel")]
    public async Task<IActionResult> Cancel(ApiRequest paremeter)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Update_Cancel");
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


    [HttpPut]
    public async Task<IActionResult> Put(ApiRequest request)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.ComprobanteIngreso_Update");
            _dbAccess.AddDynamicParam("userRoleId", idUsuarioRol);
            _dbAccess.AddDynamicParam("json", DataConverters.SerializeDictionary(request.Data));
            _response = _dbAccess.GetDefault();
        }
        finally
        {
            _dbAccess.Close();
        }

        return Ok(_response);
    }
}
