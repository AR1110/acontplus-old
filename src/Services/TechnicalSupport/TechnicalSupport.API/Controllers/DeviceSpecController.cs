namespace TechnicalSupport.API.Controllers
{
    public class DeviceSpecController : BaseApiController
    {
        private IDeviceSpecService _service;
        private readonly ICustomLogger _log;

        public DeviceSpecController(IDeviceSpecService service, ICustomLogger log)
        {
            _service = service;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(json)}
                };

                var response = await _service.GetAsync(parameters);
                if (response == null) { return BadRequest("Can't Get Data"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Get " + ex);
                return BadRequest(ex);
            }
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DeviceSpecs data)
        {
            try
            {
                data.UserId = User.GetUserId();
                var response = await _service.AddAsync(data);
                if (response == null) { return BadRequest("Cant Save"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: " + ex.Message);
                return BadRequest("Error on post");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] DeviceSpecs data)
        {
            try
            {
                data.UserId = User.GetUserId();
                var response = await _service.UpdateAsync(id, data);
                if (response == null) { return BadRequest("Cant Update"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Put: " + ex.Message);
                return BadRequest("Error on Put");
            }
        }
    }
}
