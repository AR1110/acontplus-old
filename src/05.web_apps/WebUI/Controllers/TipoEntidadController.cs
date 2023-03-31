using DataAccess;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Helpers;
using Microsoft.AspNetCore.Authorization;

namespace WebUI.Controllers
{
    public class TipoEntidadController : Controller
    {
        // GET: TipoEntidad
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoEntidadDao _te;

        public TipoEntidadController(IConfiguration config)
        {
            _config = config;
            _te = new TipoEntidadDao(_config);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TipoEntidad data)
        {            
            _gr = await _te.CreateTipoEntidadAsync(data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get(int pageIndex,int pageSize)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _te.ReadTipoEntidadAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody]TipoEntidad data)
        {
            _gr = await _te.UpdateTipoEntidadAsync(data);
            return Ok(_gr);
        }

        
        public async Task<IActionResult> Delete(int idEntidad)
        {
            _gr = await _te.DeleteTipoEntidadAsync(idEntidad);
            return Ok(_gr);
        }

        //Operaciones Especiales 
        public async Task<IActionResult> TipoEntidadSelect()
        {
            var res = await _te.TipoEntidadSelectAsync();
            return Ok(res);
        }

    }
}