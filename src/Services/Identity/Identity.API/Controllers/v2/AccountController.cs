using DataAccess;
using Domain.Dtos;
using Domain.ViewModels;
using Helpers;
using Identity.API.Dtos;
using Identity.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        private readonly LogWriter _log;
        public AccountController(IConfiguration config, ITokenService tokenService, LogWriter log)
        {
            _config = config;
            _tokenService = tokenService;
            _log = log;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto authRequest)
        {
            
            LoginDao _l = new LoginDao(_config);
            GenericResponse _gr = await _l.LoginRestaurantAsync(authRequest);
            var codSms = _gr.id as string;
            try
            {
                if (codSms == "2" || codSms == "1")
                {
                    var response = _gr.data as LoginViewModelV2;

                    var loginData = response.userData[0];
                    var loginDataDto = new LoginDataDto();

                    loginDataDto.idUsuarioRol = loginData.idRol; //para jwt authentication
                    loginDataDto.userName = loginData.userName;
                    loginDataDto.fullName = loginData.fullName;
                    loginDataDto.nroIdentificacion = loginData.nroIdentificacion;
                    loginDataDto.role = loginData.role;
                    loginDataDto.razonSocial = loginData.entidad;
                    loginDataDto.rucEmpresa = loginData.ruc ?? "";
                    loginData.companyId = loginData.companyId;
                    loginDataDto.urlGateway = _config["ApiGateways:Acontplus"];
                    loginDataDto.idUsuario = loginData.idUsuario;
                    var jwtToken = _tokenService.GenerateJwtToken(loginDataDto);
                    if (jwtToken == null) { return Unauthorized(); }
                    _log.LogActivity("Login successful: idRol -> " + Convert.ToString(loginDataDto.idUsuarioRol) + " \n jwt: " + jwtToken);

                    if (jwtToken == null)
                    {
                        _gr.Create(code: "0", message: "Error al iniciar session");
                        return Ok(_gr);
                    }
                    loginData.jwtToken = jwtToken;
                }
                return Ok(_gr);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while login into AcontplusWeb: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }


        [HttpPost("loginApp")]
        public async Task<IActionResult> LoginApp([FromBody] LoginDto authRequest)
        {
            
            LoginDao _l = new LoginDao(_config);
            GenericResponse _gr = await _l.LoginAppAsync(authRequest);
            var codSms = _gr.id as string;
            try
            {
                if (codSms == "2" || codSms == "1")
                {
                    var response = _gr.data as LoginViewModelV2;

                    var loginData = response.userData[0];
                    var loginDataDto = new LoginDataDto();

                    loginDataDto.idUsuarioRol = loginData.idRol;
                    loginDataDto.userName = loginData.userName;
                    loginDataDto.fullName = loginData.fullName;
                    loginDataDto.nroIdentificacion = loginData.nroIdentificacion;
                    loginDataDto.role = loginData.role;
                    loginDataDto.razonSocial = loginData.entidad;
                    loginDataDto.rucEmpresa = loginData.ruc ?? "";
                    loginData.companyId = loginData.companyId;
                    loginDataDto.urlGateway = _config["ApiGateways:Acontplus"];

                    var jwtToken = _tokenService.GenerateJwtToken(loginDataDto);
                    if (jwtToken == null) { return Unauthorized(); }
                    _log.LogActivity("Login successful: idRol -> " + Convert.ToString(loginDataDto.idUsuarioRol) + " \n jwt: " + jwtToken);

                    if (jwtToken == null)
                    {
                        _gr.Create(code: "0", message: "Error al iniciar session");
                        return Ok(_gr);
                    }
                    loginData.jwtToken = jwtToken;
                }
                return Ok(_gr);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while login into AcontplusWeb: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }
    }
}
