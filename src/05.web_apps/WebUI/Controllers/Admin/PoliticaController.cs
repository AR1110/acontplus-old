using Domain.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using DataAccess.Administracion;

namespace WebUI.Controllers
{
    public class PoliticaController : Controller
    {        
        readonly PoliticaDao _p = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Politica data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _p.InsertAsync(idRol, data);
            return Ok(res);
        }
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _p.GetAsync(idRol, pageIndex, pageSize);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] Politica data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _p.UpdateAsync(idRol, data);
            return Ok(res);
        }

        
        public async Task<IActionResult> Delete(int idPolitica)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _p.DeleteAsync(idRol, idPolitica);
            return Ok(res);
        }

        //Operaciones Especiales 
        public async Task<IActionResult> GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _p.GetAllAsync(idRol);
            return Ok(res);

        }
    }
}