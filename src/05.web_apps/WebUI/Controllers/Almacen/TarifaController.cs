using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Almacen
{
    public class TarifaController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TarifaDao _t ;

        public TarifaController(IConfiguration config)
        {
            _config = config;
            _t = new TarifaDao(_config);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Tarifa data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _t.CreateTarifaAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _t.ReadTarifaAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }


        [HttpPost]
        public async Task<IActionResult> Put([FromBody] Tarifa data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _t.UpdateTarifaAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Delete(int idTarifa)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _t.DeleteTarifaAsync(idRol, idTarifa);
            return Ok(_gr);
        }

       //Gestiones especiales 
       //get list tarifa para select en el Modulo de VENTA
        public async Task<IActionResult> Select()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _t.SelectAync(idRol);
            return Ok(_gr);
        }

        public async Task<IActionResult> GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _t.SelectAync(idRol);
            return Ok(_gr);
        }

    }
}
