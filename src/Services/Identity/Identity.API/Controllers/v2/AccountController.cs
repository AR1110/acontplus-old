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
        public AccountController(IConfiguration config,
                ITokenService tokenService,
                IAccountService accountService)
        {
            _config = config;
            _tokenService = tokenService;
            _accountService = accountService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequestDto authRequest)
        {
            if (string.IsNullOrEmpty(authRequest.Username))
            {
                return BadRequest("Usuario no puede estar vacio");
            }
            if (string.IsNullOrEmpty(authRequest.Password))
            {
                return BadRequest("Contraseña no puede estar vacia");
            }
            var mainResponse = await _accountService.LoginAppAsync(authRequest.Username, authRequest.Password);
            var _response = JsonConvert.DeserializeObject<ApiResponse>(mainResponse);

            if (_response.code == "1")
            {
                List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(_response.payload);

                if (userData.Count == 1)
                {
                    var user = userData[0];

                    user.UrlGateway = _config["ApiGateways:Acontplus"];

                    var token = _tokenService.CreateToken(user);

                    if (token == null || string.IsNullOrEmpty(token))
                    {
                        return BadRequest("Error al iniciar session");
                    }

                    user.Token = token;

                    _response.Create(code: "1", message: "Login Correcto", payload: user);

                    return Ok(_response);
                }
            }
            return Ok(mainResponse);
        }
        [AllowAnonymous]
        [HttpPost("createToken")]
        public IActionResult CreateToken([FromBody] UserData userData)
        {
            userData.UrlGateway = _config["ApiGateways:Acontplus"];
            var token = _tokenService.CreateToken(userData);
            if (token == null || string.IsNullOrEmpty(token))
            {
                return BadRequest("Error al iniciar session");
            }
            userData.Token = token;
            var _response = new ApiResponse();
            _response.Create(code: "1", message: "Login Correcto", payload: userData);
            return Ok(_response);
        }
    }
}
