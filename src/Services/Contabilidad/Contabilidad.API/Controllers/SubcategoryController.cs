namespace Contabilidad.API.Controllers
{
    public class SubcategoryController : BaseApiController
    {
        private readonly ISubcategoryService _subcategoryService;

        public SubcategoryController(ISubcategoryService subcategoryService)
        {
            _subcategoryService = subcategoryService;
        }
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string json)
        {
            var parameters = new Dictionary<string, object>
            {
                {"userRoleId", User.GetUserRoleId() },
                {"json", SqlStringParam.Sanitize(json)}
            };
            return Ok(await _subcategoryService.GetAsync(parameters));
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Subcategory subcategory)
        {
            subcategory.UserId = User.GetUserId();
            subcategory.CompanyId = User.GetCompanyId();
            return Ok(await _subcategoryService.AddAsync(subcategory));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Subcategory subcategory)
        {
            subcategory.UserId = User.GetUserId();
            return Ok(await _subcategoryService.UpdateAsync(id, subcategory));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _subcategoryService.DeleteAsync(User.GetUserId(), id));
        }
    }
}
