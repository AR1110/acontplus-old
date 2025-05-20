namespace Ventas.API.Controllers;

public class NotaEntregaController : BaseApiController
{
    private readonly INotaEntregaService _svc;

    public NotaEntregaController(INotaEntregaService svc)
    {
        _svc = svc;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _svc.GetAsync(new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        if (response == null) return NoContent();

        return Ok(new { code = "1", payload = response });
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var response =
            await _svc.GetByIdAsync(new Dictionary<string, object>
                { { "idRol", User.GetClaimValue<int>("userRoleId") }, { "id", id } });
        if (response == null) return NoContent();

        return Ok(new { code = "1", payload = response });
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await _svc.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpPut("Cancel/{id}")]
    public async Task<IActionResult> Delete(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        var response = await _svc.CancelAsync(parameters);
        return Ok(response);
    }

    [HttpPost("ConvertToDoc")]
    public async Task<IActionResult> ConvertToDoc(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        var response = await _svc.ConvertToDocAsync(parameters);
        return Ok(response);
    }
}