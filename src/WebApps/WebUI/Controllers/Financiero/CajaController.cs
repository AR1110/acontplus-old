using DataAccess.GestionFinanciera;
using Domain.Models.Administracion;
using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Financiero
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
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Caja data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _c.InsertAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _c.GetAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int idCaja, [FromBody] Caja data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _c.UpdateAsync(idRol, idCaja, data);
            return Ok(_gr);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int idCaja)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _c.DeleteAsync(idRol, idCaja);
            return Ok(_gr);
        }

        //Listar Caja  para Chackbox Contrapartida--
        public async Task<IActionResult> ListCaja()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _c.ListAsync(idRol);
            return Ok(_gr);
        }

        public async Task<IActionResult> GetAsigCajaUsuario()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _c.GetAsigAsync(idRol);
            return Ok(_gr);
        }

    }
}
