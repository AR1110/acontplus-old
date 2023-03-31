using DataAccess.RetencionIvaRenta;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.RetencionIvaRenta
{
    public class GenerateRetencionController : Controller
    {
        private readonly IConfiguration _configuration; 
       private GenerateRetencionDao _gr;
        public GenerateRetencionController(IConfiguration configuration)
        {
            _configuration = configuration;
            _gr = new GenerateRetencionDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        //Generar Retencion Compra Automatica 
        public async Task<IActionResult> GetGenerateRetencionCompra(int idFacturaCompra)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _gr.GetPurchaseAsync(idRol, idFacturaCompra);
            return Ok(res);
        }

        //Generar Retencion Venta Automatica 
        public async Task<IActionResult> GetGenerateRetencionVenta(int idTipoDoc, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _gr.GetSaleAsync(idRol, idTipoDoc, idComprobante);
            return Ok(res);

        }



        //Generar Retencion Compra Manual 
        public async Task<IActionResult> GetTipoImpuesto(string busqueda)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _gr.GetTipoImpuestoAsync(idRol, busqueda);
            return Ok(res);
        }




    }
}
