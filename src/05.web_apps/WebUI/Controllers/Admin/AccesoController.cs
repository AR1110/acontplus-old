using DataAccess;
using Domain.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Administracion;
using System;
using System.Linq;
using System.Collections.Generic;

namespace WebUI.Controllers
{
    public class AccesoController : Controller
    {
        // GET: Acceso        
        readonly AccesoDao _a = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(int idPolitica)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _a.GetByPoliticaAsync(idRol, idPolitica);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] List<Acceso> data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _a.UpdateAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> GetAccesoBySubMenu(int idSubMenu)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _a.GetByAccessAsync(idRol, idSubMenu);
            return Ok(res);
        }

    }
}