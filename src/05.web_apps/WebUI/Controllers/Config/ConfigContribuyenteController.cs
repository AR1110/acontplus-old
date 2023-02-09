using DataAccess;
using DataAccess.GestionTributaria;
using Domain.Models;
using Domain.ViewModels.GestionTributaria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Config
{
    public class ConfigContribuyenteController : Controller
    {
        private ConfiguracionContribuyenteDao _cc = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ConfigContribuyenteViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cc.InsertAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cc.GetAsync(idRol);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idConfigContribuyente, [FromBody] ConfigContribuyenteViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cc.PutAsycn(idRol, idConfigContribuyente, data);
            return Ok(res);
        }

        
        public async Task<IActionResult> Delete(int idConfigC)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cc.DeleteAsync(idRol, idConfigC);
            return Ok(res);
        }


        public async Task<IActionResult> GetId(int idConfigContribuyente)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cc.GetIdAsync(idRol, idConfigContribuyente);
            return Ok(res);
        }

    }
}
