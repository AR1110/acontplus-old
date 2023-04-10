using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Config
{
    public class ConfigTributariaController : Controller
    {
        //ConfigPorcentajeDao _ct = new();
        
        public IActionResult Index()
        {
            return View();
        }

        //[HttpPost]
        //public async Task<IActionResult> Post([FromBody] ConfigPorcentaje data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var res = await _ct.InsertAsync(idRol, data);
        //    return Ok(res);
        //}

        //[HttpPost]
        //public async Task<IActionResult> Put(int idConfiguracionTributaria, [FromBody] ConfigPorcentaje data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var res = await _ct.UpdateAsync(idRol,idConfiguracionTributaria, data);
        //    return Ok(res);
        //}
        //public async Task<IActionResult> Delete(int idConfigTributaria)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var res = await _ct.DeleteAsync(idConfigTributaria);
        //    return Ok(res);
        //}

    }
}
