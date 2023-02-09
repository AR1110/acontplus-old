using DataAccess;
using Domain.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using Helpers;

namespace WebUI.Controllers
{
    public class MenuController : Controller
    {
        // GET: Menu
        GenericResponse _gr = new();
        readonly MenuDao m = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Menu data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await m.InsertAsync(idRol, data);
            return Ok(_gr);
        }
        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await m.GetAsync(idRol);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idMenu, [FromBody] Menu data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await m.UpdateAsync(idRol, idMenu, data);
            return Ok(_gr);
        }
        
        public async Task<IActionResult> Delete(int idMenu)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await m.DeleteAsync(idRol, idMenu);
            return Ok(_gr);
        }

        //OTHER METHODS
        public async Task<IActionResult> GetAccesos()
        {
            _gr = await m.GetAccesosAsync();
            return Ok(_gr);
        }


    }
}