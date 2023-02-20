using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Recepcion
{
    [Authorize]
    public class DocumentoRecibidoController : Controller
    {
        private IConfiguration _configuration;
        private readonly string _apiGateway = string.Empty;
        public DocumentoRecibidoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _apiGateway = _configuration.GetSection("UrlApis").GetSection("ApiGateway").Value;
        }
        public IActionResult Index()
        {
            ViewData["urlGateway"] = _apiGateway;
            return View();
        }
    }
}
