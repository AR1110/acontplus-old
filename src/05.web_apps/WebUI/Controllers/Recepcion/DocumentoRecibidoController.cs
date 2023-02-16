using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Recepcion
{
    [Authorize]
    public class DocumentoRecibidoController : Controller
    {
        private IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private readonly int _idRol;
        private readonly string _apiGateway = string.Empty;
        public DocumentoRecibidoController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _apiGateway = _configuration.GetSection("UrlApis").GetSection("ApiGateway").Value;
        }
        public IActionResult Index()
        {
            ViewData["idRol"] = _idRol;
            ViewData["urlGateway"] = _apiGateway;
            return View();
        }
    }
}
