using WebUI.Internal.Compras;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Compras
{
    public class CompraController : Controller
    {
        private readonly IConfiguration _configuration;
        private IngresoBodegaInternal _ib;
        public CompraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ib = new IngresoBodegaInternal(_configuration);
        }
        //FacturaCompraInternal _fc = new();
        
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }             


        //Orden de Compra 
        //[HttpPost]
        //public async Task<IActionResult> CrudOrdenCompra(int tipo, int idFacturaCompra, [FromBody] FacturaCompraViewModel data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = await _fc.CrudFacturaCompra(tipo, idRol, idFacturaCompra, data);
        //    return Ok(res);
        //}

        //Ingreso a Bodega
        [HttpPost]
        public async Task<IActionResult> PostIngresoBodega(int tipo, int idIngresoBodega, [FromBody] IngresoBodegaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _ib.PostIngresoBoega(tipo, idRol, idIngresoBodega, data);
            return Ok(res);
        }

       
    }
}
