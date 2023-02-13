using BL.JwtAuthenticationManger;
using Common.Logs;
using Domain.Auth.Dtos;
using Domain.Auth.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApiAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly JwtTokenHandler _jwtTokenHandler;
        public AccountController(JwtTokenHandler jwtTokenHandler, IConfiguration config) => (_jwtTokenHandler, _config) = (jwtTokenHandler, config);

        [HttpPost]
        public ActionResult<AuthResponse?> Login([FromBody] LoginDataDto authRequest)
        {
            LogWriter _log = new LogWriter(_config);
            var authResponse = _jwtTokenHandler.GenerateJwtToken(authRequest);
            if (authResponse == null) { return Unauthorized(); }
            _log.LogInfo("Login successful: idRol -> " + Convert.ToString(authRequest.idUsuarioRol));
            return authResponse;
        }         
    }
}
