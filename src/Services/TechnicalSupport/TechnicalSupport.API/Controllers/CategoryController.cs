namespace TechnicalSupport.API.Controllers
{
    public class CategoryController : BaseApiController
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;

        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var response = await _categoryService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
            if (response == null) { return BadRequest("Can't Get brand"); };
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Category category)
        {
            category.UserId = User.GetUserId();
            var response = await _categoryService.AddAsync(category);
            return Ok(response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Category category)
        {
            category.UserId = User.GetUserId();
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
}
