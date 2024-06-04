using FactElect.API.Models;

namespace FactElect.API.Controllers;

public class TransportistaController : BaseApiController
{
    private readonly IConfiguration _configuration;


    public TransportistaController(IConfiguration configuration)
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
            
            await _db.SPExecute("Logistica.Transportista_Get");
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

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] Transportista data)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            
            await _db.SPExecute("Logistica.Transportista_Insert");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("idTipoIdentificacion", data.idTipoIdentificacion);
            _db.AddDynamicParam("nroIdentificacion", data.nroIdentificacion);
            _db.AddDynamicParam("nombre", data.nombre);
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Transportista data)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            
            await _db.SPExecute("Logistica.Transportista_Update");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("nroIdentificacion", data.nroIdentificacion);
            _db.AddDynamicParam("nombre", data.nombre);
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
            
            await _db.SPExecute("Logistica.Transportista_Delete");
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
