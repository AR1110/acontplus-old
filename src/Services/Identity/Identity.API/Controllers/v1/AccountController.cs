using Identity.API.Helpers;

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
        //User founded
        if (response.Code == "1" && !string.IsNullOrEmpty(response.Payload))
        {
            List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(response.Payload);

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
                        var logingHistory = new LoginHistory
                        {
                            UserId = userData[0].UserId,
                            CreatedByUserId = userData[0].UserId,
                            Username = userData[0].Username,
                            UserRoleId = userData[0].UserRoleId,
                            UserAgent = UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent).userAgent,
                            IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper
                                .SummarizeUserAgent(authRequest.UserAgent).ipAddress),
                            Token = token.Token,
                            TokenExpiration = token.Expires
                        };

                        await loginHistoryService.AddAsync(logingHistory);

                        logingHistory.UserAgent = authRequest.UserAgent;
                        await accountService.AddNotificationAsync(logingHistory);

                        return Ok(new
                        {
                            code = "1",
                            message = "Login correcto",
                            payload = JsonConvert.SerializeObject(userData,
                                new JsonSerializerSettings
                                {
                                    ContractResolver =
                                        new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                                    Formatting = Formatting.Indented
                                })
                        });
                    }
                case 1 when userData[0].NeedAuthorization:
                    return Ok(new
                    {
                        code = "1",
                        message = "Su ingreso requiere ser autenticado, espere la confirmación",
                        payload = JsonConvert.SerializeObject(userData,
                            new JsonSerializerSettings
                            {
                                ContractResolver =
                                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                                Formatting = Formatting.Indented
                            })
                    });
                case > 1:
                    return Ok(new
                    {
                        code = "1",
                        message = "Seleccione la empresa",
                        payload = JsonConvert.SerializeObject(userData,
                            new JsonSerializerSettings
                            {
                                ContractResolver =
                                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                                Formatting = Formatting.Indented
                            })
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
                UserAgent = UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent).userAgent,
                IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent)
                    .ipAddress),
                Username = authRequest.Username,
                Password = authRequest.Password
            };
            await loginFailedService.AddAsync(loginFailed);
        }

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> CreateToken([FromBody] UserData userData)
    {
        userData.UrlGateway = config["ApiGateways:Acontplus"];
        var token = tokenService.CreateToken(userData);
        if (token == null || string.IsNullOrEmpty(token.Token)) return BadRequest("Error al iniciar session");

        var logingHistory = new LoginHistory
        {
            CreatedByUserId = userData.UserId,
            Username = userData.Username,
            UserRoleId = userData.UserRoleId,
            UserAgent = UserAgentHelper.SummarizeUserAgent(userData.UserAgent).userAgent,
            IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper.SummarizeUserAgent(userData.UserAgent)
                .ipAddress),
            Token = token.Token,
            TokenExpiration = token.Expires
        };
        await loginHistoryService.AddAsync(logingHistory);
        logingHistory.UserAgent = userData.UserAgent;
        await accountService.AddNotificationAsync(logingHistory);
        userData.Token = token.Token;
        return Ok(new
        {
            code = "1",
            message = "Login correcto",
            payload = JsonConvert.SerializeObject(userData,
                new JsonSerializerSettings
                {
                    ContractResolver =
                        new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                    Formatting = Formatting.Indented
                })
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
