namespace FactElect.API.Controllers;

public class NotaCreditoController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;


    public NotaCreditoController(IConfiguration configuration)
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
            
            await _db.SPExecute("Ventas.NotaCredito_Get", true);
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
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
    public async Task<IActionResult> Post(ApiRequest data)
    {
        var _response = new ApiResponse();
        try
        {
            
            await _db.SPExecute("Ventas.NotaCredito_Insert", true);
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
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
    public async Task<IActionResult> Put(int id, ApiRequest parameters)
    {
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Ventas.NotaCredito_Update", true);
            _db.AddDynamicParam("userRoleId",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));

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
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Ventas.NotaCredito_Delete", true);
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
