using Identity.API.Dtos;
using Identity.Core.Interfaces;
using Identity.Core.Models;
using Lib.Common.Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Services.Common.Logs;

namespace Identity.API.Controllers.v3
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("3.0")]
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
                var _response = JsonConvert.DeserializeObject<APIResponse>(await _accountService.LoginRestaurantAsync(authRequest.Username, authRequest.Password));

                if (_response.code == "1")
                {
                    List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(_response.payload);

                    if (userData.Count == 1)
                    {
                        userData.ForEach(x => x.UrlGateway = _config["ApiGateways:Acontplus"]);

                        var jwtToken = _tokenService.CreateToken(userData.FirstOrDefault());

                        if (jwtToken != null)
                        {
                            _log.LogActivity("Login successful jwt: " + jwtToken);
                        }
                        else
                        {
                            return BadRequest("Error al iniciar session");
                        }

                        userData.ForEach(x => x.Token = jwtToken);

                        return Ok(new
                        {
                            code = "1",
                            message = "Login correcto",
                            payload = JsonConvert.SerializeObject(userData, new JsonSerializerSettings
                            {
                                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                                Formatting = Formatting.Indented
                            })
                        });
                    }
                }
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while login into Acontplus Restaurant: " + ex.ToString());
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
                return Ok(new
                {
                    code = "1",
                    message = "Login correcto",
                    payload = JsonConvert.SerializeObject(userData, new JsonSerializerSettings
                    {
                        ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                        Formatting = Formatting.Indented
                    })
                });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while login in Acontplus Restaurant: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }
    }
}
