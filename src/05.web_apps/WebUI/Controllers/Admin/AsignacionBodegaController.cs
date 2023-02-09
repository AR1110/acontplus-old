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
    public class AsignacionBodegaController : Controller
    {
        AsignacionBodegaDao _asignB = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }



        /* const json = {  
            typeList: 0,          
            idAsignacionSucursal: item.idAsignacionSucursal
        }
        */
        public async Task<IActionResult> Get(string json)
        {            
            return Ok(await _asignB.GetAsync(json));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AsignacionBodega data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _asignB.InsertAsync(idRol, data));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _asignB.UpdateAsync(idRol, id));
        }

    }
}
