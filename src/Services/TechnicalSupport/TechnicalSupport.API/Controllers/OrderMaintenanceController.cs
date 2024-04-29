namespace TechnicalSupport.API.Controllers
{
    public class OrderMaintenanceController : BaseApiController
    {
        private readonly IOrderMaintenanceService _service;
        private readonly ICustomLogger _log;

        public OrderMaintenanceController(IOrderMaintenanceService service, ICustomLogger log)
        {
            _service = service;
            _log = log;
        }


        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() }
                    ,{ "json", SqlStringParam.Sanitize(json) }
                };

                var response = await _service.GetAsync(parameters);
                if (response == null) { return BadRequest("Cant get Data"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on get: {json} \n {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest request)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(request.Data))}
                };
                var response = await _service.AddAsync(parameters);

                if (response == null) { return BadRequest("No response"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on post: " + ex.ToString());
                return BadRequest("Error on post");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id },
                    { "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(request.Data)) }
                };

                var response = await _service.UpdateAsync(parameters);

                if (response == null) { return BadRequest("No response"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on put: " + ex.ToString());
                return BadRequest("Error on put");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _service.DeleteAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on delete: " + ex.ToString());
                return BadRequest("Error on delete");
            }
        }
    }
}
