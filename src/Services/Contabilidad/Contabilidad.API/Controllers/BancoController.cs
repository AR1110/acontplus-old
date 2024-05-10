namespace Contabilidad.API.Controllers;

public class BancoController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;

    public BancoController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _db.SPExecute("Contabilidad.Banco_Get");
            _db.AddDynamicParam("userRoleId", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
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
            await _db.SPExecute("Contabilidad.Banco_Insert");
            _db.AddDynamicParam("userRoleId",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDefault();
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
            await _db.SPExecute("Contabilidad.Banco_Update");
            _db.AddDynamicParam("userRoleId",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDefault();
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
            await _db.SPExecute("Contabilidad.Banco_Delete");
            _db.AddDynamicParam("userRoleId",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
