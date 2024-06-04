namespace Ventas.API.Controllers;

public class AprobacionDocumentoController : BaseApiController
{
    private readonly IConfiguration _configuration;
    
    private readonly IAprobacionDocService _svc;

    public AprobacionDocumentoController(IConfiguration configuration, ICustomLogger log, IAprobacionDocService svc)
    {
        _configuration = configuration;
        
        _svc = svc;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Ventas.Aprob_Document_Get", true);
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

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        var response = await _svc.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "id", id } };
        var response = await _svc.DeleteAsync(parameters);
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var _db = new DbAccess(_configuration);
        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Ventas.Aprob_Document_Get_Id");
            _db.AddDynamicParam("id", id);
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("ConvertToDoc")]
    public async Task<IActionResult> ConvertToDoc(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        var response = await _svc.ConvertToDocAsync(parameters);
        return Ok(response);
    }
}
