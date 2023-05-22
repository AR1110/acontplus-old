using Common.Logs;
using DataAccess;
using Domain.Models.Ventas;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    public class AprobDocumentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
