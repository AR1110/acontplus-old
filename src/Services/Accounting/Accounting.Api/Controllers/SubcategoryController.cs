namespace Accounting.Api.Controllers;

public class SubcategoryController(ISubcategoryRepository subcategoryService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await subcategoryService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] SubcategoryCreate subcategoryDto)
    {
        var subcategory = subcategoryDto.Adapt<Subcategory>();
        subcategory.CreatedByUserId = User.GetUserId();
        subcategory.CompanyId = User.GetClaimValue<int>("companyId");

        return Ok(await subcategoryService.AddAsync(subcategory));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] SubcategoryUpdate subcategoryDto)
    {
        var subcategory = subcategoryDto.Adapt<Subcategory>();
        subcategory.UpdatedByUserId = User.GetUserId();

        return Ok(await subcategoryService.UpdateAsync(id, subcategory));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await subcategoryService.DeleteAsync(User.GetUserId(), id));
    }
}
