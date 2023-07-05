using BL.JwtAuthenticationManger;
using Common.Logs;
using Domain.Auth.Dtos;
using Microsoft.AspNetCore.Mvc;
using Helpers;
using DataAccess;
using Domain.ViewModels;
using Domain.Dtos;

namespace ApiAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly JwtTokenHandler _jwtTokenHandler;
        public AccountController(JwtTokenHandler jwtTokenHandler, IConfiguration config) => (_jwtTokenHandler, _config) = (jwtTokenHandler, config);

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto authRequest)
        {
            LogWriter _logs = new LogWriter(_config);
            LoginDao _l = new LoginDao(_config);
            GenericResponse _gr = await _l.LoginAsync(authRequest);
            var codSms = _gr.id as string;
            try
            {
                if (codSms == "2")
                {
                    var response = _gr.data as LoginViewModel;

                    var loginData = response.userData[0];
                    var loginDataDto = new LoginDataDto();

                    loginDataDto.idUsuarioRol = loginData.idRol; //para jwt authentication
                    loginDataDto.userName = loginData.userName;
                    loginDataDto.fullName = loginData.fullName;
                    loginDataDto.nroIdentificacion = loginData.nroIdentificacion;
                    loginDataDto.role = loginData.role;
                    loginDataDto.razonSocial = loginData.entidad;
                    loginDataDto.rucEmpresa = loginData.ruc ?? "";
                    loginDataDto.urlGateway = _config.GetSection("UrlApis").GetSection("UrlGateway").Value;

                    var _authService = _jwtTokenHandler.GenerateJwtToken(loginDataDto);
                    if (_authService == null) { return Unauthorized(); }
                    _logs.LogInfo("Login successful: idRol -> " + Convert.ToString(loginDataDto.idUsuarioRol) + " \n jwt: " + _authService.jwtToken);

                    if (_authService.jwtToken == null)
                    {
                        _gr.Create(code: "0", message: "Error al iniciar session");
                        return Ok(_gr);
                    }
                    loginData.jwtToken = _authService.jwtToken;
                }
                return Ok(_gr);
            }
            catch (Exception ex)
            {
                _logs.LogError("Error while login into AcontplusWeb: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }

    }
}
