namespace Accounting.Api.Controllers;

public class CategoryController(ICategoryRepository categoryService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await categoryService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Category category)
    {
        category.CreatedByUserId = User.GetUserId();
        return Ok(await categoryService.AddAsync(category));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Category category)
    {
        category.UpdatedByUserId = User.GetUserId();
        return Ok(await categoryService.UpdateAsync(id, category));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await categoryService.DeleteAsync(User.GetUserId(), id));
    }
}
