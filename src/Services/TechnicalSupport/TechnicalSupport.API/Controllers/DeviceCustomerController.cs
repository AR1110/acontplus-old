namespace TechnicalSupport.API.Controllers
{
    public class DeviceCustomerController : BaseApiController
    {
        private IDeviceCustomerService _service;

        public DeviceCustomerController(IDeviceCustomerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var parameters = new Dictionary<string, object>
            {
                {"userRoleId", User.GetUserRoleId()},
                {"json", SqlStringParam.Sanitize(json)}
            };
            var response = await _service.GetAsync(parameters);
            if (response == null)
            {
                return BadRequest("Can't Get Data");
            }
            return Ok(response);
        }
    }
}
