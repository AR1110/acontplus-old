using Asp.Versioning;
using Common.Core.Models;
using Identity.API.Dtos;
using Identity.Core.Entities;
using Identity.Core.Interfaces;
using Identity.Core.Models;
using Identity.Infrastructure.Data;
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
        private readonly ApplicationDbContext _context;

        private readonly IConfiguration _config;
        private readonly ITokenService _tokenService;
        private readonly IAccountService _accountService;
        private readonly LogWriter _log;
        public AccountController(IConfiguration config,
                ITokenService tokenService,
                LogWriter log,
                IAccountService accountService,
                            ApplicationDbContext context)
        {
            _config = config;
            _tokenService = tokenService;
            _log = log;
            _accountService = accountService;
            _context = context;
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
                var _response = JsonConvert.DeserializeObject<APIResponse>(await _accountService.LoginRestaurantAsync(authRequest.Username, authRequest.Password));

                if (_response.code == "1")
                {
                    List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(_response.payload);

                    if (userData.Count == 1)
                    {
                        userData.ForEach(x => x.UrlGateway = _config["ApiGateways:Acontplus"]);

                        var token = _tokenService.CreateToken(userData.FirstOrDefault());

                        if (token == null || string.IsNullOrEmpty(token))
                        {
                            _log.LogActivity("Error al generar el token in restaurant: " + _response.payload);
                            return BadRequest("Error al iniciar session");
                        }

                        userData.ForEach(x => x.Token = token);

                        _context.LoginHistories.Add(new LoginHistory { UserId = userData[0].UserId, Username = userData[0].Username, UserRoleId = userData[0].UserRoleId, UserAgent = authRequest.UserAgent, Token = token });
                        await _context.SaveChangesAsync();

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
                else
                {
                    _context.loginFaileds.Add(new LoginFailed { UserAgent = authRequest.UserAgent, Username = authRequest.Username, Password = authRequest.Password });
                    await _context.SaveChangesAsync();
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
        public async Task<IActionResult> CreateToken([FromBody] UserData userData)
        {
            try
            {
                userData.UrlGateway = _config["ApiGateways:Acontplus"];
                var token = _tokenService.CreateToken(userData);
                if (token == null || string.IsNullOrEmpty(token))
                {
                    _log.LogActivity("Error al generar el token en Restaurant: " + JsonConvert.SerializeObject(userData));
                    return BadRequest("Error al iniciar session");
                }
                else
                {
                    _context.LoginHistories.Add(new LoginHistory { UserId = userData.UserId, Username = userData.Username, UserRoleId = userData.UserRoleId, UserAgent = userData.UserAgent, Token = token });
                    await _context.SaveChangesAsync();
                }
                userData.Token = token;
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
