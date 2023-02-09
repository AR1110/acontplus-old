using DataAccess.Asignaciones;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Admin
{
    public class AsignacionPuntoEmisionController : Controller
    {
        AsignacionPuntoEmisionDao _asignE = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRolSession = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);            
            return Ok(await _asignE.GetAsync(json));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AsignacionPuntoEmision data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _asignE.InsertAsync(idRol, data));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _asignE.UpdateAsync(idRol, id));
        }
    }
}
