using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Finanzas
{
    public class TiempoCreditoController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TiempoCreditoDao _tc;

        public TiempoCreditoController(IConfiguration config)
        {
            _config = config;
            _tc = new TiempoCreditoDao(_config);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TiempoCredito data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _tc.InsertAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _tc.GetAsync(idRol, pageIndex, pageSize);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idTiempoCredito, [FromBody] TiempoCredito data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _tc.UpdateAsync(idRol, idTiempoCredito, data);
            return Ok(res);
        }

        public async Task<IActionResult> Delete(int idTiempoCredito)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _tc.DeleteAsync(idRol, idTiempoCredito);
            return Ok(res);
        }

        //Gestiones Especiales         
        public async Task<IActionResult> OptionTiempoCredito(bool gestion)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _tc.OptionAsync(idRol, gestion);
            return Ok(res);
        }

        public async Task<IActionResult> GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _tc.GetAllAsync(idRol);
            return Ok(res);
        }
    }
}
