using Domain.Models;
using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Helpers;

namespace WebUI.Controllers
{
    public class TipoIceController : Controller
    {
        // GET: TipoIce
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoIceDao _ti;

        public TipoIceController(IConfiguration config)
        {
            _config = config;
            _ti = new TipoIceDao(_config);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TipoIce data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ti.CreateTipoIceAsync(idRol,data);
            return Ok(_gr);
        }
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ti.ReadTipoIceAsync(idRol,pageIndex, pageSize);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody]TipoIce data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ti.UpdateTipoIceAsync(idRol,data);
            return Ok(_gr);
        }

        
        public async Task<IActionResult> Delete(int idTipoIce)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ti.DeleteTipoIceAsync(idRol,idTipoIce);
            return Ok(_gr);
        }


        //Operaciones Especiales 
        public async Task<IActionResult> OptionTipoIce()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _ti.OptionTipoIceAsync(idRol);
            return Ok(_gr);
        }
    }
}