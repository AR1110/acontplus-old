using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common.PdfReports;

namespace WebUI.Controllers.Ventas
{
    [Authorize]
    public class RetencionAtsController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _idRol;
        private readonly string _apiGateway = string.Empty;
        public RetencionAtsController(IConfiguration configuration,
                                      IHttpContextAccessor httpContextAccessor)
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

        //public IActionResult Export()
        //{
        //    return File(new DocElectPdf().PdfData(, "application/pdf", "report.pdf");
        //}
    }
}
