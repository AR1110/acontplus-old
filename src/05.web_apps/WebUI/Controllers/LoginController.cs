using System.Security.Claims;
using Common.Logs;
using DataAccess;
using Domain.Auth.Dtos;
using Domain.Auth.Models;
using Domain.Dtos;
using Domain.ViewModels;
using Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebUI.ApiClient;

namespace WebUI.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
    {

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private LoginDao _l;

        public LoginController(IConfiguration config)
        {
            _config = config;
            _l = new LoginDao(_config);
        }

        public IActionResult Index(string returnUrl)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto data)
        {
            LogWriter _logs = new LogWriter(_config);

            _gr = await _l.LoginAsync(data);
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
                    loginDataDto.ruc = loginData.ruc ?? "";

                    var urlService = _config.GetSection("UrlApis").GetSection("ApiGateway").Value;
                    var _authService = await new ApiServer(urlService).PostAsync<AuthResponse>("api/account", loginDataDto);
                    loginData.jwtToken = _authService.jwtToken;

                    //for more information review https://docs.microsoft.com/en-us/aspnet/core/security/authentication/cookie?view=aspnetcore-6.0

                    var claims = new List<Claim>
                    {
                        new Claim("idRol", Convert.ToString(loginData.idRol)),
                        new Claim("idUsuarioRol", Convert.ToString(loginData.idRol)), //para migrar jwt
                        new Claim(ClaimTypes.UserData, Convert.ToString(loginData.userName)),
                        new Claim(ClaimTypes.NameIdentifier, loginData.userName),
                        new Claim(ClaimTypes.Name, loginData.fullName),
                        new Claim(ClaimTypes.Role, loginData.role)
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    var authProperties = new AuthenticationProperties
                    {
                        //AllowRefresh = <bool>,
                        // Refreshing the authentication session should be allowed.

                        //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
                        // The time at which the authentication ticket expires. A 
                        // value set here overrides the ExpireTimeSpan option of 
                        // CookieAuthenticationOptions set with AddCookie.

                        IsPersistent = data.rememberMe
                        // Whether the authentication session is persisted across 
                        // multiple requests. When used with cookies, controls
                        // whether the cookie's lifetime is absolute (matching the
                        // lifetime of the authentication ticket) or session-based.

                        //IssuedUtc = <DateTimeOffset>,
                        // The time at which the authentication ticket was issued.

                        //RedirectUri = <string>
                        // The full path or absolute URI to be used as an http 
                        // redirect response value.
                    };
                    await HttpContext.SignInAsync(
                                CookieAuthenticationDefaults.AuthenticationScheme,
                                new ClaimsPrincipal(claimsIdentity),
                                authProperties);
                    //saveLoginLocation(u.idRol);

                }
                return Ok(_gr);
            }
            catch (Exception ex)
            {
                _logs.LogError("Error while login into AcontplusWeb: " + ex.StackTrace);
                return new BadRequestObjectResult(new
                {
                    code = "0",
                    message = "Error el iniciar sesion, comuniquese con el área de soporte"
                });
            }
        }
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.User = null;
            return Redirect("/");
        }

        //Gestiones Especiales
        //public async Task<IActionResult> ListSucursalAccesso()
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    _gr = await _l.ListSucursalAccessAsync(idRol);
        //    return Ok(_gr);
        //}
    }
}