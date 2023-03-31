using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace AcontPlus.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _config;

        GenericResponse _gr = new();
        private DashboardDao _d;
        public HomeController(IConfiguration config)
        {
            _config = config;
            _d = new DashboardDao(_config);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public async Task<IActionResult> ReadGestionCantidad()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _d.GetAsync(idRol);
            return Ok(_gr);
        }

        public IActionResult BackendAlive()
        {
            return Ok();
        }

        public PartialViewResult RenderView(string name)
        {
            return PartialView(name);
            //return PartialView($"~/Views/{name}");
        }


    }
}