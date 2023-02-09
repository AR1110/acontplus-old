using DataAccess;
using Domain.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using DataAccess.Almacen;
using Helpers;

namespace WebUI.Controllers
{
    public class UbicacionArticuloController : Controller
    {
        // GET: UbicacionArticulo
        GenericResponse _gr = new();
        readonly ArticuloUbicacionDao _ua = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ArticuloUbicacion data)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ua.InsertAsync(idRol, data);
            return Ok(_gr);
        }
        
        public async Task<IActionResult> Get(int idArticulo)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ua.GetAsync(idRol, idArticulo);
            return Ok(_gr);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] ArticuloUbicacion data)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ua.UpdateAsync(idRol, id, data);
            return Ok(_gr);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ua.DeleteAsync(idRol, id);
            return Ok(_gr);
        }
    }
}