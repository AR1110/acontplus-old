using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Ventas
{
    public class ConsultarPrecioController : Controller
    {
        
        public IActionResult Index()
        {
            return View();
        }
    }
}
