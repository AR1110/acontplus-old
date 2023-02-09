using DataAccess.Logistica;
using Domain.Models.Logistica;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Logistica
{
    public class VehiculoController : Controller
    {
        VehiculoDao _v = new();
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Vehiculo data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _v.InsertAsync(idRol, data);
            return Ok(res);
        }
        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _v.GetAsync(idRol);
            return Ok(res);
        }
        [HttpPost]
        public async Task<IActionResult> Put(int id, [FromBody] Vehiculo data){
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x=>x.Type=="idRol").Value);
            var res = await _v.PutAsycn(idRol,id, data);
            return Ok(res);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _v.DeleteAsync(idRol, id);
            return Ok(res);
        }

        //Search 
        public async Task<IActionResult> Search(string text)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _v.SearchAsync(idRol, text);
            return Ok(res);
        }
    }
}
