namespace Contabilidad.API.Controllers;

public class AnticipoController : BaseApiController
{
    private readonly IAnticipoService _anticipoSvc;

    public AnticipoController(IAnticipoService anticipoSvc)
    {
        _anticipoSvc = anticipoSvc;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _anticipoSvc.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        if (response == null) return NoContent();

        ;
        return Ok(new { code = "1", payload = response });
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };

        var response = await _anticipoSvc.AddAsync(parameters);
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };

        var response = await _anticipoSvc.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await _anticipoSvc.DeleteAsync(parameters);
        return Ok(response);
    }
}