namespace Ventas.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class NotaEntregaController : ControllerBase
{
    private readonly IConfiguration _configuration;

    private readonly INotaEntregaService _notaEntrega;

    public NotaEntregaController(IConfiguration configuration, INotaEntregaService notaEntrega)
    {
        _configuration = configuration;
        _notaEntrega = notaEntrega;

    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _notaEntrega.GetAsync(new Dictionary<string, object>
            {
                { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
        if (response == null) { return NoContent(); }
        return Ok(new { code = "1", payload = response });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var response =
            await _notaEntrega.GetByIdAsync(new Dictionary<string, object>
            {
                    { "idRol", User.GetUserRoleId() }, { "id", id }
            });
        if (response == null) { return NoContent(); }
        return Ok(new { code = "1", payload = response });
    }

    [HttpPost]
    public async Task<IActionResult> Insert([FromBody] ApiRequest data)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(_configuration);
        try
        {

            await _db.SPExecute("Ventas.NotaEntrega_Insert", true);
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
    public async Task<IActionResult> Update(int id, ApiRequest parameters)
    {
        var _db = new DbAccess(_configuration);

        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Ventas.NotaEntrega_Update", true);
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
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
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Ventas.NotaEntrega_Delete");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
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
