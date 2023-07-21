using Services.Common.Logs;
using DataAccess;
using Domain.Models;
using Domain.Models.Inventario;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Inventario
{
    public class TransferenciaBodegaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
