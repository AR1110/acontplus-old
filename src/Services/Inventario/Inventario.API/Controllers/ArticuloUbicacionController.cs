namespace Inventario.API.Controllers;

public class ArticuloUbicacionController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;


    public ArticuloUbicacionController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);

    }


    [HttpPost]
    public async Task<IActionResult> Insert(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Inventario.ArticuloUbicacion_Insert", true);
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
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
    public async Task<IActionResult> Update(int id, string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Inventario.ArticuloUbicacion_Update", true);
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
            await _db.SPExecute("Inventario.ArticuloUbicacion_Delete", true);
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
