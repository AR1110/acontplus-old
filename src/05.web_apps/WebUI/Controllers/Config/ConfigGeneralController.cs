using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class ConfigGeneralController : Controller
    {
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
    }
}
