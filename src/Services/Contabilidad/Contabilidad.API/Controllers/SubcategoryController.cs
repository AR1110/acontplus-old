namespace Contabilidad.API.Controllers;

public class SubcategoryController(ISubcategoryService subcategoryService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await subcategoryService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Subcategory subcategory)
    {
        subcategory.UserId = User.GetUserId();
        subcategory.CompanyId = User.GetClaimValue<int>("companyId");
        return Ok(await subcategoryService.AddAsync(subcategory));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Subcategory subcategory)
    {
        subcategory.UserId = User.GetUserId();
        return Ok(await subcategoryService.UpdateAsync(id, subcategory));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await subcategoryService.DeleteAsync(User.GetUserId(), id));
    }
}
