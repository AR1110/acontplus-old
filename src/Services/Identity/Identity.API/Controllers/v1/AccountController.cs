using AutoMapper;
using DataAccess;
using Domain.Dtos;
using Domain.ViewModels;
using Helpers;
using Identity.API.Dtos;
using Identity.API.Entities;
using Identity.API.Errors;
using Identity.API.Extensions;
using Identity.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using System.Security.Claims;

namespace Identity.API.Controllers.v1
{
    [Route("api/account/[action]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ITokenService tokenService, IMapper mapper, IConfiguration config)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = HttpContext.User.Claims.Single(x => x.Type == "Email").Value;
            var userId = HttpContext.User.FindFirstValue("userId");

            var user = await _userManager.FindByEmailFromClaimsPrincipal(HttpContext.User);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }
        //[AllowAnonymous]

        //[HttpPost("login")]
        //public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        //{
        //    var user = await _userManager.FindByEmailAsync(loginDto.Email);

        //    if (user == null) return Unauthorized(new ApiResponse(401));

        //    var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        //    if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

        //    return new UserDto
        //    {
        //        Email = user.Email,
        //        Token = await _tokenService.CreateToken(user),
        //        DisplayName = user.DisplayName
        //    };
        //}
        [AllowAnonymous]

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse
                { Errors = new[] { "Email address is in use" } });
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };
        }
        [AllowAnonymous]

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            var user = await _userManager.FindUserByClaimsPrincipleWithAddress(User);

            return _mapper.Map<Address, AddressDto>(user.Address);
        }

        [HttpPut("address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindUserByClaimsPrincipleWithAddress(User);

            user.Address = _mapper.Map<AddressDto, Address>(address);

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return Ok(_mapper.Map<AddressDto>(user.Address));

            return BadRequest("Problem updating the user");
        }
        [HttpPost]
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
                    loginDataDto.companyId = loginData.companyId;
                    loginDataDto.urlGateway = _config["ApiGateways:Acontplus"];
                    loginDataDto.idUsuario = loginData.idUsuario;
                    var jwtToken = _tokenService.GenerateJwtToken(loginDataDto);
                    if (jwtToken == null) { return Unauthorized(); }
                    _logs.LogInfo("Login successful: idRol -> " + Convert.ToString(loginDataDto.idUsuarioRol) + " \n jwt: " + jwtToken);

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
                _logs.LogError("Error while login into AcontplusWeb: " + ex.ToString());
                return BadRequest("Error on login");
            }
        }
    }
}
