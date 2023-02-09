using WebUI.Utils;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Helpers;

namespace WebUI.Controllers
{
    public class ValidarDatosController : Controller
    {
        GenericResponse _gr = new();
        
        ValidacionesExternas ve = new();
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult VerificarDatos([FromBody] HelpersResponse data)
        {
            var res = ve.VerificarDatos(data);
            return Ok(res);
        }
    }
}
