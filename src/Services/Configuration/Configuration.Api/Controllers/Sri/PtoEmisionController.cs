namespace Configuration.Api.Controllers.Sri;

[Route("api/[controller]")]
[ApiController]
public class PtoEmisionController : ControllerBase
{
    private readonly IPtoEmisionService _service;

    public PtoEmisionController(IPtoEmisionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _service.GetAsync(parameters);
        if (response == null) return NoContent();

        ;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(CreatePtoEmisionDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreatePtoEmisionDto>(data)) }
    };
        var response = await _service.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, UpdatePtoEmisionDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "id", id },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdatePtoEmisionDto>(data)) }
    };
        var response = await _service.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await _service.DeleteAsync(parameters);
        return Ok(response);
    }
}