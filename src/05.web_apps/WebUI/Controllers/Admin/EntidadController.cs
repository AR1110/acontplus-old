using DataAccess;
using Domain.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System;
using DataAccess.Administracion;
using Newtonsoft.Json;

namespace WebUI.Controllers
{
    public class EntidadController : Controller
    {        
        readonly EntidadDao _e = new();        

        // GET: Entidad
        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        public async Task<IActionResult> OptionEntidad()
        {
           int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
           var res = await _e.OptionAsync(idRol);
           return Ok(res);
        }
       

        //OTHER METHODS
        public async Task<IActionResult> GetAll()
        {
           int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var response = await _e.OptionAsync(idRol);
           return Ok(response);
        }
    }
}