namespace Compras.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ArticuloController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    private readonly ICustomLogger _log;

    public ArticuloController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
        _db = new DbAccess(_configuration);
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Recepcion.Articulo_Get");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("jsonData", SqlStringParam.Sanitize(json));
            _response = await _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al obtener los articulos: " + ex);
            _response.Create("0", "Error al obtener los articulos");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
