namespace Identity.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;
    private readonly IConfiguration _config;
    private readonly ITokenService _tokenService;

    public AccountController(IConfiguration config,
        ITokenService tokenService,
        IAccountService accountService)
    {
        _config = config;
        _tokenService = tokenService;
        _accountService = accountService;
    }

    [AllowAnonymous]
    [HttpPost("Login")]
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

        var _response = await _accountService.LoginAppAsync(authRequest.Username, authRequest.Password);
        
        if (_response.Code == "1" && !string.IsNullOrEmpty(_response.Payload))
        {
            List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(_response.Payload);

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
                _response.Create("1", "Login Correcto", user);

                return Ok(_response);
            }
        }

        return Ok(_response);
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
        var _response = new ApiResponseDeprecated();
        _response.Create("1", "Login Correcto", userData);
        return Ok(_response);
    }
}
