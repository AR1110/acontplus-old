namespace FactElect.API.Controllers;

public class NotificacionTributariaController : BaseApiController
{
    private readonly IConfiguration _configuration;
    

    public NotificacionTributariaController(IConfiguration configuration)
    {
        _configuration = configuration;
        
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("FactElect.Notificacion_Tributaria_Get");
            _db.AddDynamicParam("id", id);
            _response = _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("FactElect.Notificacion_Tributaria_Insert");
            _db.AddDynamicParam("idRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
