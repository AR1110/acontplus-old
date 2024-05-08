namespace Contabilidad.API.Controllers
{
    public class CategoryController : BaseApiController
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string json)
        {
            var parameters = new Dictionary<string, object> {
                {"userRoleId", User.GetUserRoleId() },
                {"json", SqlStringParam.Sanitize(json)}
            };
            return Ok(await _categoryService.GetAsync(parameters));
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Category category)
        {
            category.UserId = User.GetUserId();
            return Ok(await _categoryService.AddAsync(category));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Category category)
        {
            category.UserId = User.GetUserId();
            return Ok(await _categoryService.UpdateAsync(id, category));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _categoryService.DeleteAsync(User.GetUserId(), id));
        }
    }
}
