namespace Inventario.API.Controllers;

public class EtiquetaController : BaseApiController
{
    public readonly IConfiguration _configuration;
    public readonly DbAccess _db;
    

    public EtiquetaController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(configuration);
        
    }

    [HttpGet("Get/{json}")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Inventario.Etiqueta_Get");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", json);
            _response = await _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Inventario.Etiqueta_Insert");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", json);
            _response = await _db.GetDefaultAsync();
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
        try
        {
            await _db.SpExecuteAsync("Inventario.Etiqueta_Update");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", json);

            _response = await _db.GetDefaultAsync();
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
        try
        {
            await _db.SpExecuteAsync("Inventario.Etiqueta_Delete");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);

            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
