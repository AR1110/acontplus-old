using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class ConfigDocController : Controller
    {
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
    }
}
