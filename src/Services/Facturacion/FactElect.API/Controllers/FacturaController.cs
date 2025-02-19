namespace FactElect.API.Controllers;

public class FacturaController(IFacturaService service) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await service.GetAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        if (response == null) { return NoContent(); }

        return Ok(new { code = "1", payload = response });
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await service.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await service.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = await service.GetByIdAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "id", id }
        });
        if (response == null) { return NoContent(); }

        return Ok(new { code = "1", payload = response });
    }


    [HttpPut("Cancel/{id}")]
    public async Task<IActionResult> Cancel(int id, ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await service.CancelAsync(parameters);
        return Ok(response);
    }
}
