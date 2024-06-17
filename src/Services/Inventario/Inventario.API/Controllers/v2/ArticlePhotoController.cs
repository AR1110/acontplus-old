namespace Inventario.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class ArticlePhotoController : ControllerBase
{
    private readonly IConfiguration _configuration;
    

    public ArticlePhotoController(IConfiguration configuration)
    {
        _configuration = configuration;
        
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);

        try
        {
            await _db.SPExecute("Inventario.Articulo_Get_Id");
            _db.AddDynamicParam("id", id);
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
