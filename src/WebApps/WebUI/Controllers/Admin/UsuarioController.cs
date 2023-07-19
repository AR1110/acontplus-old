using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class UsuarioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Perfil() => View();

    }
}