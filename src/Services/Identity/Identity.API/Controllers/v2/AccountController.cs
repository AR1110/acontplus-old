using Common.Core.Models;
using Identity.API.Dtos;
using Identity.Core.Interfaces;
using Identity.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace Identity.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ITokenService _tokenService;
        private readonly IAccountService _accountService;
        private readonly LogWriter _log;
        public AccountController(IConfiguration config,
                ITokenService tokenService,
                LogWriter log,
                IAccountService accountService)
        {
            _config = config;
            _tokenService = tokenService;
            _log = log;
            _accountService = accountService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequestDto authRequest)
        {
            try
            {
                if (string.IsNullOrEmpty(authRequest.Username))
                {
                    return BadRequest("Usuario no puede estar vacio");
                }
                if (string.IsNullOrEmpty(authRequest.Password))
                {
                    return BadRequest("Contraseña no puede estar vacia");
                }
                var mainResponse = await _accountService.LoginAppAsync(authRequest.Username, authRequest.Password);
                var _response = JsonConvert.DeserializeObject<APIResponse>(mainResponse);

                if (_response.code == "1")
                {
                    List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(_response.payload);

                    if (userData.Count == 1)
                    {
                        var user = userData[0];

                        user.UrlGateway = _config["ApiGateways:Acontplus"];

                        var jwtToken = _tokenService.CreateToken(user);

                        if (jwtToken != null)
                        {
                            _log.LogActivity("Login successful jwt: " + jwtToken);
                        }
                        else
                        {
                            return BadRequest("Error al iniciar session");
                        }

                        user.Token = jwtToken;

                        _response.Create(code: "1", message: "Login Correcto", payload: user);

                        return Ok(_response);
                    }
                }
                return Ok(mainResponse);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while login into Acontplus App: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }
        [AllowAnonymous]
        [HttpPost("createToken")]
        public IActionResult CreateToken([FromBody] UserData userData)
        {
            try
            {
                userData.UrlGateway = _config["ApiGateways:Acontplus"];
                var jwtToken = _tokenService.CreateToken(userData);
                if (jwtToken != null)
                {
                    _log.LogActivity("Login successful: userRoleId" + Convert.ToString(userData.UserRoleId) + " \n jwt: " + jwtToken);
                }
                else
                {
                    return BadRequest("Error al iniciar session");
                }
                userData.Token = jwtToken;
                var _response = new APIResponse();
                _response.Create(code: "1", message: "Login Correcto", payload: userData);
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while login into Acontplus App: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }
    }
}
