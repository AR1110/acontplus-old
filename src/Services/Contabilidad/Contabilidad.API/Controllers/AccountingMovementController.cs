using Contabilidad.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Contabilidad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountingMovementController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string json)
        {
            var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
            return Ok(await subcategoryService.GetAsync(parameters));
        }
    }
}
