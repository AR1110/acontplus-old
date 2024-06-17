namespace Contabilidad.API.Controllers;

public class CuentaPorPagarController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _dbAccess;

    public CuentaPorPagarController(IConfiguration configuration)
    {
        _configuration = configuration;
        _dbAccess = new DbAccess(_configuration);
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Get");
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

    [HttpPost("{json}")]
    public async Task<IActionResult> Post(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Insert");
            _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _dbAccess.GetDefault();
        }
        finally
        {
            _dbAccess.Close();
        }

        return Ok(_response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, CuentaPorPagarDto data)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Update");
            _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _dbAccess.AddDynamicParam("idCuentaPorPagar", id);
            _dbAccess.AddDynamicParam("json", SqlStringParam.Sanitize(data.cuotas));
            _response = _dbAccess.GetDefault();
        }
        finally
        {
            _dbAccess.Close();
        }

        return Ok(_response);
    }
}
