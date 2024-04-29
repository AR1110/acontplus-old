namespace TechnicalSupport.API.Controllers
{
    public class BrandController : BaseApiController
    {
        private readonly IBrandService _brandService;
        private readonly ICustomLogger _log;
        public BrandController(IBrandService brandService, ICustomLogger log)
        {
            _brandService = brandService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _brandService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get:\n {ex}");
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Brand brand)
        {
            try
            {
                brand.UserId = User.GetUserId();
                var response = await _brandService.AddAsync(brand);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on post: \n {ex} \n {JsonConvert.SerializeObject(brand)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Brand brand)
        {
            try
            {
                brand.UserId = User.GetUserId();
                var response = await _brandService.UpdateAsync(id, brand);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on put: {id} \n {ex} \n  {JsonConvert.SerializeObject(brand)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _brandService.DeleteAsync(User.GetUserId(), id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on delete: {id} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
    }
}
