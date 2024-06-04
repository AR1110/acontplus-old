namespace Inventario.API.Controllers;

public class ProductController : BaseApiController
{

    private readonly IProductService _service;

    public ProductController(IProductService service)
    {
        _service = service;

    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse>> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
        var response = await _service.GetAsync(parameters);
        if (response == null) { return NoContent(); }

            ;
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult> Post(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
            };
        var response = await _service.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult> Put(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
            };
        var response = await _service.UpdateAsync(parameters);
        return Ok(response);
    }
}
