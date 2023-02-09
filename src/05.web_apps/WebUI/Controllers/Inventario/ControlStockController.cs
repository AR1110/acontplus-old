using DataAccess.Inventario;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Inventario
{
    public class ControlStockController : Controller
    {
        private readonly IConfiguration _config;
        private ControlStockDao _cs;
        public ControlStockController(IConfiguration config)
        {
            _config = config;
            _cs = new ControlStockDao(_config);
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> VerificarStock(int idArticulo, decimal cantidad, string presentacion, int idPresentacion)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cs.GetAsync(idRol, idArticulo, cantidad, presentacion, idPresentacion);
            return Ok(res);

        }

        public async Task<IActionResult> Update(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cs.UpdateAsync(idRol, id);
            return Ok(res);

        }


    }
}
