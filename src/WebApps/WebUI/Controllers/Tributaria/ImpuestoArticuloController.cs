using Common.Core.Models;
using DataAccess.GestionTributaria;
using Domain.Models.GestionTributaria;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Tributaria
{
    public class ImpuestoArticuloController : Controller
    {
        private IConfiguration _config;
        private ImpuestoArticuloDao _ia;
        public ImpuestoArticuloController(IConfiguration config)
        {
            _config = config;
            _ia = new ImpuestoArticuloDao(_config);
        }
        // GET: ImpuestoArticulo
        GenericResponse _gr = new();
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ImpuestoArticulo data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ia.InsertAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get(int idArticulo)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ia.GetIdAsync(idRol, idArticulo);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Update(int idImpuestoArticulo, [FromBody] ImpuestoArticulo data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ia.UpdateAsync(idRol, idImpuestoArticulo, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Delete(int idImpuestoArticulo)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ia.DeleteAsync(idRol, idImpuestoArticulo);
            return Ok(_gr);
        }


        public async Task<IActionResult> ListaPost([FromBody] List<ImpuestoArticulo> data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ia.ListaInsertAsync(idRol, data);
            return Ok(_gr);
        }


    }
}