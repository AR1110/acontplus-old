using Acontplus.Core.Extensions;
using Identity.API.DTOs;

namespace Identity.API.Controllers.v3;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("3.0")]
public class AccountController(
    IConfiguration config,
    IJwtTokenService tokenService,
    ILoginFailedService loginFailedService,
    ILoginHistoryService loginHistoryService,
    IAccountService accountService)
    : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequestDto authRequest)
    {
        var fromMobile = HttpContext.Items["FromMobile"] as bool? ?? false;

        if (string.IsNullOrEmpty(authRequest.Username)) return BadRequest("Usuario no puede estar vacio");

        if (string.IsNullOrEmpty(authRequest.Password)) return BadRequest("Contraseña no puede estar vacia");

        var response = await accountService.LoginRestaurantAsync(authRequest.Username, authRequest.Password);

        if (response.Code == "1")
        {
            List<UserDataDto> userData = JsonExtensions.DeserializeOptimized<List<UserDataDto>>(response.Payload);

            switch (userData.Count)
            {
                case 1:
                    {
                        userData.ForEach(x => x.UrlGateway = config["ApiGateways:Acontplus"]);

                        var token = tokenService.CreateToken(userData.FirstOrDefault());

                        if (token == null || string.IsNullOrEmpty(token.Token))
                            return BadRequest("Error al iniciar session");

                        userData.ForEach(x => x.Token = token.Token);

                        var loginHistory = new LoginHistory
                        {
                            CreatedByUserId = userData[0].UserId,
                            UserRoleId = userData[0].UserRoleId,
                            UserAgent = authRequest.UserAgent,
                            Token = token.Token,
                            TokenExpiration = token.Expires,
                            IsMobileRequest = fromMobile,
                            Id = 0
                        };
                        await loginHistoryService.AddAsync(loginHistory);
                        loginHistory.UserAgent = authRequest.UserAgent;
                        await accountService.AddNotificationAsync(loginHistory);
                        return Ok(new SpResponse
                        {
                            Code = "0",
                            Message = "Login Correcto!",
                            Payload = JsonExtensions.SerializeOptimized(userData)
                        });
                    }
            }
        }
        else
        {
            var loginFailed = new LoginFailed
            {
                UserAgent = authRequest.UserAgent,
                Username = authRequest.Username,
                Password = authRequest.Password,
                IsMobileRequest = fromMobile,
                Id = 0
            };
            await loginFailedService.AddAsync(loginFailed);
        }

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("createToken")]
    public async Task<IActionResult> CreateToken([FromBody] UserDataDto userData)
    {
        var fromMobile = HttpContext.Items["FromMobile"] as bool? ?? false;
        userData.UrlGateway = config["ApiGateways:Acontplus"];
        var token = tokenService.CreateToken(userData);
        if (token == null || string.IsNullOrEmpty(token.Token)) return BadRequest("Error al iniciar session");

        var loginHistory = new LoginHistory
        {
            CreatedByUserId = userData.UserId,
            UserRoleId = userData.UserRoleId,
            UserAgent = userData.UserAgent,
            Token = token.Token,
            TokenExpiration = token.Expires,
            IsMobileRequest = fromMobile,
            Id = 0
        };
        await loginHistoryService.AddAsync(loginHistory);
        loginHistory.UserAgent = userData.UserAgent;
        await accountService.AddNotificationAsync(loginHistory);
        userData.Token = token.Token;
        return Ok(new SpResponse
        {
            Code = "0",
            Message = "Login Correcto!",
            Payload = JsonExtensions.SerializeOptimized(userData)
        });
    }
}
