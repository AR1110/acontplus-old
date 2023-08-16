using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private readonly IConfigurationService _configurationService;

        public ConfigurationController(IConfigurationService configurationService)
        {
            _configurationService = configurationService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", json}
                };

                var response = await _configurationService.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest("Error on getting items: " + ex.Message);
            }
        }
    }
}
