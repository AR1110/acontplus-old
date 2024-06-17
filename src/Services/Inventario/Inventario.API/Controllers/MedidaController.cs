using Common.Core.Models.Almacen;

namespace Inventario.API.Controllers;

public class MedidaController : BaseApiController
{
    private readonly IConfiguration _configuration;


    public MedidaController(IConfiguration configuration)
    {
        _configuration = configuration;

    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Medida_Get");
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
    public async Task<IActionResult> Insert([FromBody] Medida data)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Medida_Insert");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("descripcion", data.descripcion);
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Medida data)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Medida_Update");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("descripcion", data.descripcion);
            _db.AddDynamicParam("estado", data.estado);
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
            await _db.SPExecute("Almacen.Medida_Delete");
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
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Medida_For_Select");
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
