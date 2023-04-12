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
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Perfil()=> View();      

    }
}