namespace TechnicalSupport.Api.Controllers;

public class BrandController : BaseApiController
{
    private readonly IBrandRepository _brandService;

    public BrandController(IBrandRepository brandService)
    {
        _brandService = brandService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _brandService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Brand brand)
    {
        brand.CreatedByUserId = User.GetUserId();
        var response = await _brandService.AddAsync(brand);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Brand brand)
    {
        brand.UpdatedByUserId = User.GetUserId();
        var response = await _brandService.UpdateAsync(id, brand);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _brandService.DeleteAsync(User.GetUserId(), id);
        return Ok(response);
    }
}
