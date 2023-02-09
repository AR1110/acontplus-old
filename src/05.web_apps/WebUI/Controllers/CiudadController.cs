using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class CiudadController : Controller
    {
        GenericResponse _gr = new();
        readonly CiudadDao c = new();
        public IActionResult Index()
        {
            return View(); 
        }

        public IActionResult ReadCiudadProvincia()
        {
            _gr = c.ReadCiudad(); 
            return Ok(_gr);
        }
    }
}
