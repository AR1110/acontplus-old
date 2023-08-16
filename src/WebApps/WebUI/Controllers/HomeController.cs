using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace AcontPlus.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _configuration;
        
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration; 
        }
        public IActionResult Index()
        { 
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
