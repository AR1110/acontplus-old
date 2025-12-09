namespace Sales.Api.Controllers;

public class AprobacionDocumentoController(IAprobacionDocService svc) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await svc.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(CreateAprobacionDocumentoDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateAprobacionDocumentoDto>(request)) }
        };
        var response = await svc.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, UpdateAprobacionDocumentoDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateAprobacionDocumentoDto>(request)) }
        };
        var response = await svc.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await svc.DeleteAsync(parameters);
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        return Ok(await svc.GetByIdAsync(parameters));
    }

    [HttpPost("ConvertToDoc")]
    public async Task<IActionResult> ConvertToDoc(ConvertToDocumentDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<ConvertToDocumentDto>(request)) }
        };
        var response = await svc.ConvertToDocAsync(parameters);
        return Ok(response);
    }
}
