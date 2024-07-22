 
namespace Ventas.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreditoGaranteController(ICreditoGaranteService _svc) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(json) }
            };

            return Ok(await _svc.GetAsync(parameters));
        }

        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
            };

            return Ok(await _svc.AddAsync(parameters));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                {"id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
            };

            return Ok(await _svc.UpdateAsync(parameters));
        }
    }
}
