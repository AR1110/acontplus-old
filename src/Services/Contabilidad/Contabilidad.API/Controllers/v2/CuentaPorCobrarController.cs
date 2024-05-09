namespace Contabilidad.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class CuentaPorCobrarController : ControllerBase
    {
        private readonly ICuentaPorCobrarService _service;
        public CuentaPorCobrarController(ICuentaPorCobrarService service)
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
            if (response == null) { return NoContent(); };
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ApiRequest data)
        {
            var parameters = new Dictionary<string, object>
            {
                {"userRoleId", User.GetUserRoleId()},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
            };

            var response = await _service.AddAsync(parameters);
            if (response == null) { return NoContent(); };
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ApiRequest data)
        {
            var parameters = new Dictionary<string, object>
            {
                {"userRoleId", User.GetUserRoleId()},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
            };

            var response = await _service.UpdateAsync(parameters);
            if (response == null) { return NoContent(); };
            return Ok(response);
        }
    }
}
