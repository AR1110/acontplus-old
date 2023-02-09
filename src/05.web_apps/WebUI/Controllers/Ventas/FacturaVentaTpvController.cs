using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    public class FacturaVentaTpvController : Controller
    {
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
    }
}
