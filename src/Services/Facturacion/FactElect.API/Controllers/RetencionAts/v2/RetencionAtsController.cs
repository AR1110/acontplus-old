namespace FactElect.API.Controllers.RetencionAts.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class RetencionAtsController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    

    public RetencionAtsController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
        
    }

    [HttpPut("Cancel/{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var _response = new ApiResponse();
        try
        {
            
            await _db.SPExecute("FactElect.RetencionAts_Cancel");
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
