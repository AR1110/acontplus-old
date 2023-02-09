using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<AplicacionController> _logger;

        private readonly IConfiguration _config;

        private readonly LoginService _lSvc;
        public LoginController(ILogger<AplicacionController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _lSvc = new LoginService(_config);
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] Login data)
        {
            return Ok(await _lSvc.LoginAsync(data));
        }

    }
}
