using DataAccess.Compras;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Compras
{
    public class NotaVentaController : Controller
    {
        private readonly IConfiguration _configuration;

        private NotaVentaDao _nv;
        public NotaVentaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _nv = new NotaVentaDao(_configuration);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] NotaVentaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _nv.InsertAsync(idRol, data);
            return Ok(res);
        }
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _nv.GetAsync(idRol,pageIndex, pageSize);
            return Ok(res);
        }
        public async Task<IActionResult> GetId(int idNotaVenta)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _nv.GetIdAsync(idRol, idNotaVenta);
            return Ok(res);
        }
        [HttpPost]
        public async Task<IActionResult> Put(int idNotaVenta, [FromBody] NotaVentaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _nv.UpdateAsync(idRol,idNotaVenta, data);
            return Ok(res);
        }
        public async Task<IActionResult> Delete(int idNotaVenta)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _nv.DeleteAsync(idRol, idNotaVenta);
            return Ok(res);
        }
    }
}
