using Asp.Versioning;
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

        public AccountController(ITokenService tokenService, IConfiguration config, LogWriter log, ApplicationDbContext context, IAccountService accountService)
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
                var _response = await _accountService.LoginAsync(authRequest.Username, authRequest.Password);
                //User founded
                if (_response.code == "1" && !string.IsNullOrEmpty(_response.payload))
                {
                    //dynamic container = JsonConvert.DeserializeObject<dynamic>(_response.payload);
                    //Guid guid;
                    //if (Guid.TryParse(container[0].uuid?.ToString(), out guid))
                    //{
                    //    Console.WriteLine(guid);
                    //}
                    ////else
                    ////{
                    ////    Console.WriteLine("No guid present or it has an invalid format");
                    ////}
                    List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(_response.payload);

                    if (authRequest.ReturnUrl == "/") { authRequest.ReturnUrl = null; }

                    userData.ForEach(x => x.ReturnUrl = authRequest.ReturnUrl ?? "/Home/Index");

                    if (userData.Count == 1 && !userData[0].NeedAuthorization)
                    {
                        userData.ForEach(x => x.UrlGateway = _config["ApiGateways:Acontplus"]);

                        var token = _tokenService.CreateToken(userData.FirstOrDefault());

                        if (token == null || string.IsNullOrEmpty(token))
                        {
                            _log.LogActivity("Error al generar el token en Acontplus Web: " + _response.payload);
                            return BadRequest("Error al iniciar session");
                        }

                        userData.ForEach(x => x.Token = token);
                        var logingHistory = new LoginHistory { UserId = userData[0].UserId, Username = userData[0].Username, UserRoleId = userData[0].UserRoleId, UserAgent = authRequest.UserAgent, Token = token };
                        _context.LoginHistories.Add(logingHistory);
                        await _context.SaveChangesAsync();

                        await _accountService.AddNotificationAsync(logingHistory);

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
                    else if (userData.Count == 1 && userData[0].NeedAuthorization)
                    {
                        return Ok(new
                        {
                            code = "1",
                            message = "Su ingreso requiere ser autenticado, espere la confirmación",
                            payload = JsonConvert.SerializeObject(userData, new JsonSerializerSettings
                            {
                                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                                Formatting = Formatting.Indented
                            })
                        });
                    }
                    if (userData.Count > 1)
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
                    _context.LoginFaileds.Add(new LoginFailed { UserAgent = authRequest.UserAgent, Username = authRequest.Username, Password = authRequest.Password });
                    await _context.SaveChangesAsync();
                }
                return Ok(_response);
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
                    var logingHistory = new LoginHistory { UserId = userData.UserId, Username = userData.Username, UserRoleId = userData.UserRoleId, UserAgent = userData.UserAgent, Token = token };
                    _context.LoginHistories.Add(logingHistory);
                    await _context.SaveChangesAsync();
                    await _accountService.AddNotificationAsync(logingHistory);
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
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> RequestAccess([FromBody] RequestAccessDto data)
        {
            try
            {
                var response = await _accountService.RequestAccessAsync(data);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while verify code into Acontplus ERP: " + ex.ToString());
                return BadRequest("Error on verify code");
            }
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Authenticate([FromBody] AccessAuthorization data)
        {
            try
            {
                var response = await _accountService.AuthenticateAsync(data);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while verify code into Acontplus ERP: " + ex.ToString());
                return BadRequest("Error on verify code");
            }
        }
    }
}
