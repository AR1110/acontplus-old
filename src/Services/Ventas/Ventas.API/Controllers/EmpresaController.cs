namespace Ventas.API.Controllers;

public class EmpresaController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;


    public EmpresaController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);

    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {

            await _db.SPExecute("Administrador.Empresa_Get", true);
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = await _db.GetDataTableAsync();
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
        var _response = new ApiResponseDeprecated();
        try
        {

            await _db.SPExecute("Administrador.Empresa_Insert", true);
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
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
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Administrador.Empresa_Update", true);
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
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
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Administrador.Empresa_Delete", true);
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
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
