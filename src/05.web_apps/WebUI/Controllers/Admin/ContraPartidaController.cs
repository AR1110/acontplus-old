using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Admin
{
    public class ContraPartidaController : Controller
    {
        GenericResponse _gr = new();
        ContraPartidaDao _cp = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ContraPartida data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cp.CreateContraPartidaAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cp.ReadContraPartidaAsync(idRol);
            return Ok(_gr);
        }
      
        [HttpPost]
        public async Task<IActionResult> Put([FromBody] ContraPartida data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cp.UpdateContraPartidaAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Delete(int idContraPartida)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cp.DeleteContraPartidaAsync(idRol, idContraPartida);
            return Ok(_gr);
        }

        //Get By Contrapartida for module cobros 
        //public async Task<IActionResult> GetBy()
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = await _cp.GetByAsync(idRol);
        //    return Ok(res);
        //}
    }
}
