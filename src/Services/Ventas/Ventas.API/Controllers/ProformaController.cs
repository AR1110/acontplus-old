namespace Ventas.API.Controllers;

public class ProformaController(IProformaService svc) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await svc.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };

        return Ok(await svc.AddAsync(parameters));
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

        return Ok(await svc.UpdateAsync(parameters));
    }


    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idRol", User.GetClaimValue<int>("userRoleId") }, { "id", id } };

        return Ok(await svc.DeleteAsync(parameters));
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object> { { "idRol", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await svc.GetByIdAsync(parameters));
    }

    [HttpPost("ConvertToDoc")]
    public async Task<IActionResult> ConvertToDoc(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };

        return Ok(await svc.ConvertToDoc(parameters));
    }
}
