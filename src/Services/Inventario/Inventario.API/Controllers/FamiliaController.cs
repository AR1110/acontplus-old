namespace Inventario.API.Controllers;

public class FamiliaController : BaseApiController
{
    private readonly IConfiguration _configuration;
    

    public FamiliaController(IConfiguration configuration)
    {
        _configuration = configuration;
        
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Familia_Get");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            var userRoleId = User.GetUserRoleId();
            await _db.SPExecute("Almacen.Familia_Insert");
            _db.AddDynamicParam("userRoleId", userRoleId);
            _db.AddDynamicParam("json", DataConverters.SerializeDictionary(request.Data));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest request)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            var userRoleId = User.GetUserRoleId();
            await _db.SPExecute("Almacen.Familia_Update");
            _db.AddDynamicParam("userRoleId", userRoleId);
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", DataConverters.SerializeDictionary(request.Data));
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
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Familia_Update_Cancel");
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

    [HttpGet("ListForSelect")]
    public async Task<IActionResult> ListForSelect(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Familia_For_Select");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _response = _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
