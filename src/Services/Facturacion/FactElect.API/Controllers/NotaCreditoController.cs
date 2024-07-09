namespace FactElect.API.Controllers;

public class NotaCreditoController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    private readonly INotaCreditoService _notaCreditoService;

    public NotaCreditoController(IConfiguration configuration, INotaCreditoService notaCreditoService)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
        _notaCreditoService = notaCreditoService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>{
            {"idRol", User.GetUserRoleId()},
            {"json", SqlStringParam.Sanitize(json)},
        };
        return Ok(await _notaCreditoService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest data)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Ventas.NotaCredito_Insert", true);
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
            _response = await _db.GetDefaultAsync();
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
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Ventas.NotaCredito_Update", true);
            _db.AddDynamicParam("userRoleId",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));

            _response = await _db.GetDefaultAsync();
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
            await _db.SpExecuteAsync("Ventas.NotaCredito_Delete", true);
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
