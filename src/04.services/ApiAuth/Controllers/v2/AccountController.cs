using BL.JwtAuthenticationManger;
using Common.Logs;
using DataAccess;
using Domain.Auth.Dtos;
using Domain.Dtos;
using Domain.ViewModels;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiAuth.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly JwtTokenHandler _jwtTokenHandler;
        public AccountController(JwtTokenHandler jwtTokenHandler, IConfiguration config) => (_jwtTokenHandler, _config) = (jwtTokenHandler, config);


        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto authRequest)
        {
            LogWriter _logs = new LogWriter(_config);
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
