namespace Identity.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class AccountController(
    IConfiguration config,
    ILoginFailedService loginFailedService,
    ILoginHistoryService loginHistoryService,
    IJwtTokenService tokenService,
    IAccountService accountService)
    : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] AuthRequestDto authRequest)
    {
        if (string.IsNullOrEmpty(authRequest.Username)) return BadRequest("Usuario no puede estar vacio");

        if (string.IsNullOrEmpty(authRequest.Password)) return BadRequest("Contraseña no puede estar vacia");

        var response = await accountService.LoginAppAsync(authRequest.Username, authRequest.Password);

        if (response.Code != "1" || string.IsNullOrEmpty(response.Payload)) return Ok(response);

        List<UserData> userData = Newtonsoft.Json.JsonConvert.DeserializeObject<List<UserData>>(response.Payload);

        if (userData.Count != 1) return Ok(response);

        var user = userData[0];
        user.UrlGateway = config["ApiGateways:Acontplus"];

        var token = tokenService.CreateToken(user);

        if (token == null || string.IsNullOrEmpty(token.Token))
        {
            if (string.IsNullOrEmpty(authRequest.UserAgent) ||
                string.IsNullOrEmpty(authRequest.Username) ||
                string.IsNullOrEmpty(authRequest.Password))
                return Ok(response);

            var loginFailed = new LoginFailed
            {
                UserAgent = authRequest.UserAgent ?? HttpContext.Request.Headers.UserAgent.ToString(),
                Username = authRequest.Username,
                Password = authRequest.Password,
                IsMobileRequest = true,
                Id = 0
            };
            await loginFailedService.AddAsync(loginFailed);
            return BadRequest("Error al iniciar session");
        }

        var loginHistory = new LoginHistory
        {
            CreatedByUserId = userData[0].UserId,
            UserRoleId = userData[0].UserRoleId,
            UserAgent = authRequest.UserAgent ?? HttpContext.Request.Headers.UserAgent.ToString(),
            Token = token.Token,
            TokenExpiration = token.Expires,
            Id = 0
        };

        await loginHistoryService.AddAsync(loginHistory);
        loginHistory.UserAgent = authRequest.UserAgent;
        await accountService.AddNotificationAsync(loginHistory);
        user.Token = token.Token;
        return Ok(new SpResponse { Code = "0", Payload = user, Message = "Login Correcto" });
    }

    [AllowAnonymous]
    [HttpPost("createToken")]
    public async Task<IActionResult> CreateToken([FromBody] UserData userData)
    {
        userData.UrlGateway = config["ApiGateways:Acontplus"];
        var token = tokenService.CreateToken(userData);
        if (token == null || string.IsNullOrEmpty(token.Token)) return BadRequest("Error al iniciar session");

        var loginHistory = new LoginHistory
        {
            CreatedByUserId = userData.UserId,
            UserRoleId = userData.UserRoleId,
            UserAgent = userData.UserAgent ?? HttpContext.Request.Headers.UserAgent.ToString(),
            Token = token.Token,
            TokenExpiration = token.Expires,
            IsMobileRequest = true,
            Id = 0
        };
        await loginHistoryService.AddAsync(loginHistory);
        loginHistory.UserAgent = userData.UserAgent;
        await accountService.AddNotificationAsync(loginHistory);
        userData.Token = token.Token;
        return Ok(new SpResponse { Code = "0", Payload = userData, Message = "Login Correcto" });
    }
}
