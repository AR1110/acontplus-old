using System;
using System.Linq;
using System.Threading.Tasks;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class BancoController : Controller
    {
        // GET: Banco        
        BancoDao _b = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Banco data)        
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _b.CreateBancoAsync(idRol,data);
            return Ok(res);
        }

        public async Task<IActionResult> Get(int pageIndex,int pageSize)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _b.ReadBanco(idRol,pageIndex,pageSize);
            return Ok(res);
        }
        [HttpPost]
        public async Task<IActionResult> Put([FromBody] Banco data)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _b.UpdateBancoAsync(idRol,data);
            return Ok(res);
        }
        
        public async Task<IActionResult> Delete(int idBanco) 
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _b.DeleteBancoAsync(idRol,idBanco);
            return Ok(res);
        }


        //Get banco 
        public async Task<IActionResult> GetByAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _b.GetByOptionAsync(idRol);
            return Ok(res);
        }

    }
}