using FactElect.API.Models;

namespace FactElect.API.Controllers;

public class VehiculoController : BaseApiController
{
    private readonly IConfiguration _configuration;


    public VehiculoController(IConfiguration configuration)
    {
        _configuration = configuration;

    }

    /*
     const json = {
        typeList: 0, --Lista Normal
        typeList: 1 => Para lISTAR EN SELECT HTML
        typeList: 2 => Para buscadores(autocomplete)
    }
     */
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Logistica.Vehiculo_Get");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
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
    public async Task<IActionResult> Insert([FromBody] Vehiculo data)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Logistica.Vehiculo_Insert");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("placa", data.placa);
            _db.AddDynamicParam("marca", data.marca);
            _db.AddDynamicParam("modelo", data.modelo);
            _db.AddDynamicParam("observacion", data.observacion);
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Vehiculo data)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Logistica.Vehiculo_Update");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("placa", data.placa);
            _db.AddDynamicParam("marca", data.marca);
            _db.AddDynamicParam("modelo", data.modelo);
            _db.AddDynamicParam("observacion", data.observacion);
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
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Logistica.Vehiculo_Delete");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
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
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Logistica.Vehiculo_Search");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
