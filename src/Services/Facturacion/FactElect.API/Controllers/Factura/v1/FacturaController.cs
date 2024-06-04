namespace FactElect.API.Controllers.Factura.v1;

//[Route("api/[controller]")]
[Route("api/factura/[action]")]
[ApiController]
public class FacturaController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;


    public FacturaController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);

    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Ventas.Factura_Get", true);
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost]
    public async Task<IActionResult> Insert(ApiRequest data)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("Ventas.Factura_Insert", true);
            _db.AddDynamicParam("userRoleId", idUsuarioRol);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest data)
    {
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Ventas.Factura_Update", true);
            _db.AddDynamicParam("userRoleId",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Ventas.Factura_Get_Id", true);
            _db.AddDynamicParam("idRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _response = _db.GetDataSetAsync();
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
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Ventas.Factura_Delete", true);
            _db.AddDynamicParam("idRol",
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
