using DataAccess;
using Domain.Models;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ingresos
{
    public class CategoriaCompraController : Controller
    {
        private readonly IConfiguration _configuration;

        GenericResponse _gr = new();
        readonly CategoriaCompraDao _cc;
        public CategoriaCompraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cc = new CategoriaCompraDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }


        public async Task<IActionResult> Post([FromBody] CategoriaCompra data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cc.InsertAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cc.GetAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }
        public async Task<IActionResult> Put([FromBody] CategoriaCompra data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cc.UpdateAsync(idRol, data);
            return Ok(_gr);
        }
        public async Task<IActionResult> Delete(int idCategoriaCompra)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cc.DeleteAsync(idRol, idCategoriaCompra);
            return Ok(_gr);
        }


        //Listar Categoria en select para Documento Compra y Retencion de Compra 
        public async Task<IActionResult> selectCategoriaCompra()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cc.OptionAsync(idRol);
            return Ok(res);
        }

        public async Task<IActionResult> GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cc.OptionAsync(idRol);
            return Ok(res);

        }

    }
}
