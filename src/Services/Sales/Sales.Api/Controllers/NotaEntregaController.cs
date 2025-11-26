namespace Sales.Api.Controllers;

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
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return response == null ? NoContent() : Ok(new { code = "1", payload = response });
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var response =
            await _svc.GetByIdAsync(new Dictionary<string, object>
                { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } });
        return response == null ? NoContent() : Ok(new { code = "1", payload = response });
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(CreateNotaEntregaDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateNotaEntregaDto>(data)) }
        };
        var response = await _svc.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, UpdateNotaEntregaDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateNotaEntregaDto>(request)) }
        };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpPut("Cancel/{id}")]
    public async Task<IActionResult> Delete(int id, UpdateNotaEntregaDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateNotaEntregaDto>(request)) }
        };
        var response = await _svc.CancelAsync(parameters);
        return Ok(response);
    }

    [HttpPost("ConvertToDoc")]
    public async Task<IActionResult> ConvertToDoc(NotaEntregaConvertToDocDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<NotaEntregaConvertToDocDto>(request)) }
        };
        var response = await _svc.ConvertToDocAsync(parameters);
        return Ok(response);
    }
}
