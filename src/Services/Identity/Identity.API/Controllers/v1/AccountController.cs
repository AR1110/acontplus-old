using Acontplus.Core.Extensions;

namespace Identity.API.Controllers.v1;

[Route("api/account/[action]")]
[ApiController]
[ApiVersion("1.0")]
public class AccountController(
    IJwtTokenService tokenService,
    IConfiguration config,
    ILoginFailedService loginFailedService,
    ILoginHistoryService loginHistoryService,
    IAccountService accountService)
    : ControllerBase
{
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] AuthRequestDto authRequest)
    {
        if (string.IsNullOrEmpty(authRequest.Username)) return BadRequest("Usuario no puede estar vacio");

        if (string.IsNullOrEmpty(authRequest.Password)) return BadRequest("Contraseña no puede estar vacia");

        var response = await accountService.LoginAsync(authRequest.Username, authRequest.Password);

        if (response.Code == "1" && !string.IsNullOrEmpty(response.Payload))
        {
            List<UserDataDto> userData = JsonExtensions.DeserializeOptimized<List<UserDataDto>>(response.Payload);

            if (authRequest.ReturnUrl == "/") authRequest.ReturnUrl = null;

            userData.ForEach(x => x.ReturnUrl = authRequest.ReturnUrl ?? "/Index");

            switch (userData.Count)
            {
                case 1 when !userData[0].NeedAuthorization:
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
                            UserAgent = UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent)
                                .UserAgent,
                            IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper
                                .SummarizeUserAgent(authRequest.UserAgent)
                                .IpAddress),
                            Token = token.Token,
                            TokenExpiration = token.Expires,
                            Id = 0
                        };
                        await loginHistoryService.AddAsync(loginHistory);
                        //Originally user agent to get with another property, but now we use the one from authRequest
                        loginHistory.UserAgent = authRequest.UserAgent;
                        await accountService.AddNotificationAsync(loginHistory);
                        return Ok(new SpResponse
                        {
                            Code = "1",
                            Message = "Login Correcto!",
                            Payload = JsonExtensions.SerializeOptimized(userData)
                        });
                    }
                case 1 when userData[0].NeedAuthorization:
                    return Ok(new SpResponse
                    {
                        Code = "1",
                        Message = "Su ingreso requiere ser autenticado, espere la confirmación!",
                        Payload = JsonExtensions.SerializeOptimized(userData)
                    });
                case > 1:
                    return Ok(new SpResponse
                    {
                        Code = "1",
                        Message = "Seleccione la empresa!",
                        Payload = JsonExtensions.SerializeOptimized(userData)
                    });
            }
        }
        else
        {
            if (string.IsNullOrEmpty(authRequest.UserAgent) ||
                string.IsNullOrEmpty(authRequest.Username) ||
                string.IsNullOrEmpty(authRequest.Password))
                return Ok(response);

            var loginFailed = new LoginFailed
            {
                UserAgent = UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent)
                    .UserAgent,
                IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent)
                    .IpAddress),
                Username = authRequest.Username,
                Password = authRequest.Password,
                Id = 0
            };
            await loginFailedService.AddAsync(loginFailed);
        }

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> CreateToken([FromBody] UserDataDto userData)
    {
        userData.UrlGateway = config["ApiGateways:Acontplus"];
        var token = tokenService.CreateToken(userData);
        if (token == null || string.IsNullOrEmpty(token.Token)) return BadRequest("Error al iniciar session");

        var loginHistory = new LoginHistory
        {
            CreatedByUserId = userData.UserId,
            UserRoleId = userData.UserRoleId,
            UserAgent = UserAgentHelper.SummarizeUserAgent(userData.UserAgent)
                .UserAgent,
            IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper.SummarizeUserAgent(userData.UserAgent)
                .IpAddress),
            Token = token.Token,
            TokenExpiration = token.Expires,
            Id = 0
        };
        await loginHistoryService.AddAsync(loginHistory);
        //Originally user agent to get with another property, but now we use the one from userData
        loginHistory.UserAgent = userData.UserAgent;
        await accountService.AddNotificationAsync(loginHistory);
        userData.Token = token.Token;

        return Ok(new SpResponse
        {
            Code = "1",
            Message = "Login Correcto!",
            Payload = JsonExtensions.SerializeOptimized(userData)
        });
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> RequestAccess([FromBody] RequestAccessDto data)
    {
        var response = await accountService.RequestAccessAsync(data);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Authenticate([FromBody] AccessAuthorization data)
    {
        var response = await accountService.AuthenticateAsync(data);
        return Ok(response);
    }
}
