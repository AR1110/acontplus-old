using Common.AppSettings;
using Identity.API.Helpers;

namespace Identity.API.Controllers.v3;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("3.0")]
public class AccountController(
    IConfiguration config,
    ITokenService tokenService,
    ILoginFailedService loginFailedService,
    ILoginHistoryService loginHistoryService,
    IAccountService accountService)
    : ControllerBase
{
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

        var response =
            JsonConvert.DeserializeObject<ApiResponseDeprecated>(
                await accountService.LoginRestaurantAsync(authRequest.Username, authRequest.Password));

        if (response.code == "1")
        {
            List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(response.payload);

            switch (userData.Count)
            {
                case 1:
                {
                    userData.ForEach(x => x.UrlGateway = config["ApiGateways:Acontplus"]);

                    var token = tokenService.CreateToken(userData.FirstOrDefault());

                    if (token == null || string.IsNullOrEmpty(token.Token))
                    {
                        return BadRequest("Error al iniciar session");
                    }

                    userData.ForEach(x => x.Token = token.Token);

                    var logingHistory = new LoginHistory
                    {
                        UserId = userData[0].UserId,
                        Username = userData[0].Username,
                        UserRoleId = userData[0].UserRoleId,
                        UserAgent = authRequest.UserAgent,
                        Token = token.Token,
                        TokenExpiration = token.Expires
                    };

                    await loginHistoryService.AddAsync(logingHistory);

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
            }
        }
        else
        { 

            var loginFailed = new LoginFailed
            {
                UserAgent = authRequest.UserAgent, 
                Username = authRequest.Username,
                Password = authRequest.Password
            };
            await loginFailedService.AddAsync(loginFailed);
        }

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("createToken")]
    public async Task<IActionResult> CreateToken([FromBody] UserData userData)
    {
        userData.UrlGateway = config["ApiGateways:Acontplus"];
        var token = tokenService.CreateToken(userData);
        if (token == null || string.IsNullOrEmpty(token.Token))
        {
            return BadRequest("Error al iniciar session");
        }

        var logingHistory = new LoginHistory
        {
            UserId = userData.UserId,
            Username = userData.Username,
            UserRoleId = userData.UserRoleId,
            UserAgent = userData.UserAgent,
            Token = token.Token,
            TokenExpiration = token.Expires
        };
        await loginHistoryService.AddAsync(logingHistory);

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
}
