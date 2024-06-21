namespace Ventas.API.Controllers;

public class EmpleadoController : BaseApiController
{
    private readonly IConfiguration _configuration;
    

    public EmpleadoController(IConfiguration configuration)
    {
        _configuration = configuration;
        
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
           
            await _db.SPExecute("Ventas.Empleado_Get");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
           

            await _db.SPExecute("Ventas.Empleado_Search");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        finally { _db.Close(); }

        return Ok(_response);
    }


    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(string json)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
           
            await _db.SPExecute("Ventas.Empleado_Insert");
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

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, string json)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
           
            await _db.SPExecute("Ventas.Empleado_Update");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
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

    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
           
            await _db.SPExecute("Ventas.Empleado_Delete");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
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
