using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace AcontPlus.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
            _log = new LogWriter(_configuration);

        }
        public IActionResult Index()
        {
            _log.LogActivity("Info log");
            return View();
        }

        public IActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public IActionResult BackendAlive()
        {
            return Ok();
        }
        [AllowAnonymous]
        public PartialViewResult RenderView(string name)
        {
            return PartialView(name);
            //return PartialView($"~/Views/{name}");
        }


    }
}
