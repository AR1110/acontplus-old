using AutoMapper;
using DataAccess;
using Domain.Dtos;
using Domain.ViewModels;
using Identity.API.Dtos;
using Identity.API.Interfaces;
using Identity.Core.Entities;
using Identity.Infrastructure.Data;
using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Identity.API.Controllers.v1
{
    [Route("api/account/[action]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly LogWriter _log;
        private readonly ApplicationDbContext _context;
        public AccountController(
            ITokenService tokenService,
            IMapper mapper,
            IConfiguration config,
            LogWriter log,
            ApplicationDbContext context
            )
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _config = config;
            _log = log;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto authRequest)
        {

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
                    loginDataDto.companyId = loginData.companyId;
                    loginDataDto.urlGateway = _config["ApiGateways:Acontplus"];
                    loginDataDto.idUsuario = loginData.idUsuario;
                    var jwtToken = _tokenService.GenerateJwtToken(loginDataDto);

                    if (jwtToken == null)
                    {
                        _gr.Create(code: "0", message: "Error al iniciar session");
                        return Ok(_gr);
                    }
                    //_log.LogActivity("Login successful: userRoleId -> " + Convert.ToString(loginDataDto.idUsuarioRol) + " \n Token: " + jwtToken);
                    loginData.jwtToken = jwtToken;
                    _context.LoginHistories.Add(new LoginHistory { UserId = loginData.idUsuario, Username = loginDataDto.userName, UserRoleId = loginDataDto.idUsuarioRol, UserAgent = authRequest.userAgent, Token = jwtToken });
                    await _context.SaveChangesAsync();
                }
                else
                {
                    _context.loginFaileds.Add(new LoginFailed { UserAgent = authRequest.userAgent, Username = authRequest.username, Password = authRequest.password });
                    await _context.SaveChangesAsync();
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
