using DataAccess;
using Domain.Models;
using Domain.Models.Administracion;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
{
    public class CajaController : Controller
    {
        GenericResponse _gr = new();
        private readonly IConfiguration _config;
        private CajaDao _c;
        public CajaController(IConfiguration config)
        {
            _config = config;
            _c = new CajaDao(_config);
        }
        
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Caja data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _c.InsertAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _c.GetAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int idCaja, [FromBody] Caja data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _c.UpdateAsync(idRol, idCaja, data);
            return Ok(_gr);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int idCaja)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _c.DeleteAsync(idRol, idCaja);
            return Ok(_gr);
        }

        //Listar Caja  para Chackbox Contrapartida--
        public async Task<IActionResult> ListCaja()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _c.ListAsync(idRol);
            return Ok(_gr);
        }

        public async Task<IActionResult> GetAsigCajaUsuario()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _c.GetAsigAsync(idRol);
            return Ok(_gr);
        }

    }
}
