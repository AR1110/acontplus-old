namespace Identity.API.Controllers.v1;

[Route("api/account/[action]")]
[ApiController]
[ApiVersion("1.0")]
public class AccountController : BaseApiController
{
    private readonly IAccountService _accountService;
    private readonly IConfiguration _config;
    private readonly ApplicationDbContext _context;
    private readonly ITokenService _tokenService;

    public AccountController(ITokenService tokenService, IConfiguration config, ApplicationDbContext context,
        IAccountService accountService)
    {
        _tokenService = tokenService;
        _config = config;
        _context = context;
        _accountService = accountService;
    }

    [AllowAnonymous]
    [HttpPost]
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

        var _response = await _accountService.LoginAsync(authRequest.Username, authRequest.Password);
        //User founded
        if (_response.code == "1" && !string.IsNullOrEmpty(_response.payload))
        {
            //dynamic container = JsonConvert.DeserializeObject<dynamic>(_response.payload);
            //Guid guid;
            //if (Guid.TryParse(container[0].uuid?.ToString(), out guid))
            //{
            //    Console.WriteLine(guid);
            //}
            ////else
            ////{
            ////    Console.WriteLine("No guid present or it has an invalid format");
            ////}
            List<UserData> userData = JsonConvert.DeserializeObject<List<UserData>>(_response.payload);

            if (authRequest.ReturnUrl == "/") { authRequest.ReturnUrl = null; }

            userData.ForEach(x => x.ReturnUrl = authRequest.ReturnUrl ?? "/Home/Index");

            if (userData.Count == 1 && !userData[0].NeedAuthorization)
            {
                userData.ForEach(x => x.UrlGateway = _config["ApiGateways:Acontplus"]);

                var token = _tokenService.CreateToken(userData.FirstOrDefault());

                if (token == null || string.IsNullOrEmpty(token))
                {
                    return BadRequest("Error al iniciar session");
                }

                userData.ForEach(x => x.Token = token);
                var logingHistory = new LoginHistory
                {
                    UserId = userData[0].UserId,
                    Username = userData[0].Username,
                    UserRoleId = userData[0].UserRoleId,
                    UserAgent = authRequest.UserAgent,
                    Token = token
                };
                _context.LoginHistories.Add(logingHistory);
                await _context.SaveChangesAsync();

                await _accountService.AddNotificationAsync(logingHistory);

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

            if (userData.Count == 1 && userData[0].NeedAuthorization)
            {
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
            }

            if (userData.Count > 1)
            {
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
            _context.LoginFaileds.Add(new LoginFailed
            {
                UserAgent = authRequest.UserAgent, Username = authRequest.Username, Password = authRequest.Password
            });
            await _context.SaveChangesAsync();
        }

        return Ok(_response);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> CreateToken([FromBody] UserData userData)
    {
        userData.UrlGateway = _config["ApiGateways:Acontplus"];
        var token = _tokenService.CreateToken(userData);
        if (token == null || string.IsNullOrEmpty(token))
        {
            return BadRequest("Error al iniciar session");
        }

        var logingHistory = new LoginHistory
        {
            UserId = userData.UserId,
            Username = userData.Username,
            UserRoleId = userData.UserRoleId,
            UserAgent = userData.UserAgent,
            Token = token
        };
        _context.LoginHistories.Add(logingHistory);
        await _context.SaveChangesAsync();
        await _accountService.AddNotificationAsync(logingHistory);
        userData.Token = token;
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
        var response = await _accountService.RequestAccessAsync(data);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Authenticate([FromBody] AccessAuthorization data)
    {
        var response = await _accountService.AuthenticateAsync(data);
        return Ok(response);
    }
}
