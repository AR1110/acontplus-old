using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class RolController : Controller
    {
        GenericResponse _gr = new();

        public IActionResult Index()
        {
            return View();
        }

    }
}
