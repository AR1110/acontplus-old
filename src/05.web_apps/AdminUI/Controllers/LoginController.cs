using AdminUI.ApiClient;
using BL.Admin.Data;
using Common.Logs;
using Domain.Admin.Models;
using Domain.Auth.Dtos;
using Domain.Auth.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _config;

        private readonly LoginService _lSvc;
        public LoginController(IConfiguration config)
        {
            _config = config;
            _lSvc = new LoginService(_config);
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] Login data)
        {
            LogWriter _log = new LogWriter(_config);
            try
            {
                GenericResponse _response = new GenericResponse();
                _response = await _lSvc.LoginAsync(data);
                var loginData = _response.payload as LoginDataDto;
                var urlService = _config.GetSection("UrlApis").GetSection("ApiGateway").Value;
                var _authService = await new ApiServer(urlService).PostAsync<AuthResponse>("api/account", loginData);
                return Ok(_authService);
            }
            catch (Exception ex)
            {
                _log.LogError("Error while logging: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = "-1",
                    message = "Error al acceder"
                });
            }
        }
    }
}
