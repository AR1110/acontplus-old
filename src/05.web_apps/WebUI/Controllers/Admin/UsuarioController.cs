using Domain.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using Newtonsoft.Json;
using DataAccess.Administracion;
using Domain.ViewModels.Administracion;
using Domain.Models.Administracion;

namespace WebUI.Controllers
{
    public class UsuarioController : Controller
    {
       
        // GET: Usuario

        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        public IActionResult Perfil()=> View();      

    }
}