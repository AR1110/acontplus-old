using DataAccess.GestionFinanciera;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.GestionFinanciera
{
    public class CarteraController : Controller
    {        
        
        public IActionResult Index()
        {
            return View();
        }

       
    }
}
