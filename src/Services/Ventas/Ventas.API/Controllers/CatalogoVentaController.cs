namespace Ventas.API.Controllers;

public class CatalogoVentaController : BaseApiController
{
    private readonly IConfiguration _configuration;
    

    public CatalogoVentaController(IConfiguration configuration)
    {
        _configuration = configuration;
        
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Ventas.Catalogo_Get");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
