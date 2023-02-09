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
    public class EntidadFinancieraController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private EntidadFinancieraDao _ef;

        public EntidadFinancieraController(IConfiguration config)
        {
            _config = config;
            _ef = new EntidadFinancieraDao(_config);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] EntidadFinanciera data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ef.CreateEntidadFinancieraAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ef.ReadEntidadFinancieraAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] EntidadFinanciera data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ef.UpdateEntidadFinancieraAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Delete(int idEntidadFinanciera)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ef.DeleteEntidadFinancieraAsync(idRol, idEntidadFinanciera);
            return Ok(_gr);
        }

        //Operaciones Especiales 
        //get E.F para select 
        public async Task<IActionResult> OptionEntidadFinanciera()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ef.OptionEntidadFinancieraAsync(idRol);
            return Ok(_gr);
        }

        //List Entidad para modulo de Contrapartida 
        public async Task<IActionResult> ListEntidadFinanciera()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ef.ListEntidadFinancieraAsync(idRol);
            return Ok(_gr);
        }

    }
}
