using Identity.API.Dtos;
using Identity.API.Interfaces;
using Lib.Common.Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
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

        //[AllowAnonymous]
        //[HttpPost("login")]
        //public async Task<IActionResult> Login([FromBody] AuthRequestDto authRequest)
        //{
        //    try
        //    {
        //        var _response = JsonConvert.DeserializeObject<APIResponse>(await _accountService.LoginRestaurantAsync(authRequest.Username, authRequest.Password));

        //        if (_response.code == "1")
        //        {
        //            List<UserDataDto> userData = JsonConvert.DeserializeObject<List<UserDataDto>>(_response.payload);

        //            if (userData.Count == 1)
        //            {
        //                userData.ForEach(x => x.UrlGateway = _config["ApiGateways:Acontplus"]);

        //                var jwtToken = _tokenService.GetJwtToken(userData.FirstOrDefault());

        //                if (jwtToken == null) { return Unauthorized(); }

        //                _log.LogActivity("Login successful: userRoleId" + Convert.ToString(userData.Select(x => x.UserRoleId)) + " \n jwt: " + jwtToken);

        //                if (jwtToken == null)
        //                {
        //                    return BadRequest("Error al iniciar session");
        //                }

        //                userData.ForEach(x => x.Token = jwtToken);

        //                return Ok(new
        //                {
        //                    code = "1",
        //                    message = "Login correcto",
        //                    payload = JsonConvert.SerializeObject(userData, new JsonSerializerSettings
        //                    {
        //                        ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
        //                        Formatting = Formatting.Indented
        //                    })
        //                });
        //            }
        //        }
        //        return Ok(_response);
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogActivity("Error while login into AcontplusWeb: " + ex.ToString());
        //        return BadRequest("Error on login");
        //    }
        //}
        //[AllowAnonymous]
        //[HttpPost("createToken")]
        //public IActionResult CreateToken([FromBody] UserDataDto userData)
        //{
        //    try
        //    {
        //        userData.UrlGateway = _config["ApiGateways:Acontplus"];
        //        var jwtToken = _tokenService.GetJwtToken(userData);
        //        if (jwtToken == null) { return Unauthorized(); }
        //        _log.LogActivity("Login successful: userRoleId" + Convert.ToString(userData.UserRoleId) + " \n jwt: " + jwtToken);
        //        if (jwtToken == null)
        //        {
        //            return BadRequest("Error al iniciar session");
        //        }
        //        userData.Token = jwtToken;
        //        return Ok(new
        //        {
        //            code = "1",
        //            message = "Login correcto",
        //            payload = JsonConvert.SerializeObject(userData, new JsonSerializerSettings
        //            {
        //                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
        //                Formatting = Formatting.Indented
        //            })
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogActivity("Error while login: " + ex.ToString());
        //        return BadRequest("Error on login");
        //    }
        //}


        //[HttpPost("loginApp")]
        //public async Task<IActionResult> LoginApp([FromBody] LoginDto authRequest)
        //{

        //    LoginDao _l = new LoginDao(_config);
        //    GenericResponse _response = await _l.LoginAppAsync(authRequest);
        //    var codSms = _response.id as string;
        //    try
        //    {
        //        if (codSms == "2" || codSms == "1")
        //        {
        //            var response = _response.data as LoginViewModelV2;

        //            var loginData = response.userData[0];
        //            var loginDataDto = new LoginDataDto();

        //            loginDataDto.userIdRole = loginData.idRol;
        //            loginDataDto.username = loginData.userName;
        //            loginDataDto.fullname = loginData.fullName;
        //            loginDataDto.nroIdentificacion = loginData.nroIdentificacion;
        //            loginDataDto.role = loginData.role;
        //            loginDataDto.razonSocial = loginData.entidad;
        //            loginDataDto.rucEmpresa = loginData.ruc ?? "";
        //            loginData.companyId = loginData.companyId;
        //            loginDataDto.urlGateway = _config["ApiGateways:Acontplus"];

        //            var jwtToken = _tokenService.GenerateJwtToken(loginDataDto);
        //            if (jwtToken == null) { return Unauthorized(); }
        //            _log.LogActivity("Login successful: idRol -> " + Convert.ToString(loginDataDto.userIdRole) + " \n jwt: " + jwtToken);

        //            if (jwtToken == null)
        //            {
        //                _response.Create(code: "0", message: "Error al iniciar session");
        //                return Ok(_response);
        //            }
        //            loginData.jwtToken = jwtToken;
        //        }
        //        return Ok(_response);
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogActivity("Error while login into AcontplusWeb: " + ex.ToString());
        //        return BadRequest("Error on login");
        //    }
        //}
    }
}
