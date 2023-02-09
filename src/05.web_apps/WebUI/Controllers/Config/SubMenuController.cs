using DataAccess;
using Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Domain.Models.Administracion;
using System;
using System.Linq;

namespace WebUI.Controllers.Config
{
    public class SubMenuController : Controller
    {
        readonly SubMenuDao sm = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SubMenu data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await sm.InsertAsync(idRol, data);
            return Ok(res);
        }
        public async Task<IActionResult> GetSubMenus(int idMenu)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await sm.GetAsync(idRol, idMenu);
            return Ok(res);
        }
        [HttpPost]
        public async Task<IActionResult> Put(int idSubMenu, [FromBody] SubMenu data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await sm.UpdateAsync(idRol, idSubMenu, data);
            return Ok(res);
        }

        public async Task<IActionResult> Delete(int idSubMenu)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await sm.DeleteAsync(idRol, idSubMenu);
            return Ok(res);
        }

    }
}