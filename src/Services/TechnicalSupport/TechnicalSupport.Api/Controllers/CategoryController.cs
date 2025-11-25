namespace TechnicalSupport.Api.Controllers;

public class CategoryController : BaseApiController
{
    private const string CompanyId = "companyId";
    private readonly ICategoryRepository _categoryService;

    public CategoryController(ICategoryRepository categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _categoryService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        if (response == null) return BadRequest("Can't Get brand");

        ;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Category category)
    {
        category.CreatedByUserId = User.GetUserId();
        category.CompanyId = User.GetClaimValue<int>(CompanyId);
        var response = await _categoryService.AddAsync(category);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Category category)
    {
        category.UpdatedByUserId = User.GetUserId();
        category.CompanyId = User.GetClaimValue<int>(CompanyId);
        var response = await _categoryService.UpdateAsync(id, category);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _categoryService.DeleteAsync(User.GetUserId(), id);
        return Ok(response);
    }
}
