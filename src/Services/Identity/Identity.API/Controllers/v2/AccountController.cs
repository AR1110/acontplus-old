namespace Identity.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class AccountController(
    IConfiguration config,
    ITokenService tokenService,
    IAccountService accountService)
    : ControllerBase
{
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

        var response = await accountService.LoginAppAsync(authRequest.Username, authRequest.Password);

        if (response.Code == "1" && !string.IsNullOrEmpty(response.Payload))
        {
            List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(response.Payload);

            if (userData.Count == 1)
            {
                var user = userData[0];
                user.UrlGateway = config["ApiGateways:Acontplus"];

                var token = tokenService.CreateToken(user);

                if (token == null || string.IsNullOrEmpty(token))
                {
                    return BadRequest("Error al iniciar session");
                }

                user.Token = token;
                response.Create("1", "Login Correcto", user);

                return Ok(response);
            }
        }

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("createToken")]
    public IActionResult CreateToken([FromBody] UserData userData)
    {
        userData.UrlGateway = config["ApiGateways:Acontplus"];
        var token = tokenService.CreateToken(userData);
        if (token == null || string.IsNullOrEmpty(token))
        {
            return BadRequest("Error al iniciar session");
        }

        userData.Token = token;
        var response = new ApiResponse();
        response.Create("1", "Login Correcto", userData);
        return Ok(response);
    }
}
