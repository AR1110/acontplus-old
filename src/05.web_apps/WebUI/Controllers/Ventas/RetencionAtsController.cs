using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common.PdfReports;

namespace WebUI.Controllers.Ventas
{
    [Authorize]
    public class RetencionAtsController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string _apiGateway = string.Empty;
        public RetencionAtsController(IConfiguration configuration)
        {
            _configuration = configuration;
            _apiGateway = _configuration.GetSection("UrlApis").GetSection("ApiGateway").Value;
        }
        public IActionResult Index()
        {
            ViewData["urlGateway"] = _apiGateway;
            return View();
        }

        //public IActionResult Export()
        //{
        //    return File(new DocElectPdf().PdfData(, "application/pdf", "report.pdf");
        //}
    }
}
