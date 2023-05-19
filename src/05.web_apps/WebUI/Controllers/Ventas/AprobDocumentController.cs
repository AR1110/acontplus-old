using Common.Logs;
using DataAccess;
using Domain.Models.Ventas;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    public class AprobDocumentController : Controller
    {
        private readonly IConfiguration _configuration;
        public AprobDocumentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
