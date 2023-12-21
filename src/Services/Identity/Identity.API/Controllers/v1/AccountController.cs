using Asp.Versioning;
using Common.Core.Models;
using Identity.API.Data;
using Identity.API.Dtos;
using Identity.API.Entities;
using Identity.API.Interfaces;
using Identity.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Services.Common.Logs;

namespace Identity.API.Controllers.v1
{
    [Route("api/account/[action]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class AccountController : BaseApiController
    {
        private readonly IConfiguration _config;
        private readonly LogWriter _log;
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IAccountService _accountService;
        public AccountController(
            ITokenService tokenService,
            IConfiguration config,
            LogWriter log,
            ApplicationDbContext context,
            IAccountService accountService
            )
        {
            _tokenService = tokenService;
            _config = config;
            _log = log;
            _context = context;
            _accountService = accountService;
        }
        [AllowAnonymous]
        [HttpPost]
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
                var mainResponse = await _accountService.LoginAsync(authRequest.Username, authRequest.Password);
                var _response = JsonConvert.DeserializeObject<APIResponse>(mainResponse);
                //User founded
                if (_response.code == "1")
                {
                    List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(_response.payload);

                    if (authRequest.ReturnUrl == "/") { authRequest.ReturnUrl = null; }

                    userData.ForEach(x => x.ReturnUrl = authRequest.ReturnUrl ?? "/Home/Index");

                    //Only has one company
                    if (userData.Count == 1)
                    {
                        userData.ForEach(x => x.UrlGateway = _config["ApiGateways:Acontplus"]);

                        var token = _tokenService.CreateToken(userData.FirstOrDefault());

                        if (token == null || string.IsNullOrEmpty(token))
                        {
                            _log.LogActivity("Error al generar el token en Acontplus Web: " + _response.payload);
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
                    else
                    {
                        return Ok(new
                        {
                            code = "1",
                            message = "Seleccione la empresa",
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
                return Ok(mainResponse);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while login into Acontplus Web: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateToken([FromBody] UserData userData)
        {
            try
            {
                userData.UrlGateway = _config["ApiGateways:Acontplus"];
                var token = _tokenService.CreateToken(userData);
                if (token == null || string.IsNullOrEmpty(token))
                {
                    _log.LogActivity("Error al generar el token: " + JsonConvert.SerializeObject(userData));
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
                _log.LogActivity("Error while login into Acontplus Web: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }
    }
}
