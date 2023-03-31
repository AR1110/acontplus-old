using DataAccess.GestionFinanciera;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
{
    public class PagoController : Controller
    {
        private readonly IConfiguration _configuration;
        private PagoDao _p;
        public PagoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _p = new PagoDao(_configuration);
        }
        
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        //Get Comprobante Ingreso de la Factura         
        public async Task<IActionResult> GetByDocument(int idComprobanteEgreso, int idTipoDocumento, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _p.GetByDocumentAsync(idRol, idComprobanteEgreso, idTipoDocumento, idComprobante);
            return Ok(res);

        }

        public async Task<IActionResult> Put(int idPago, string observacion, bool pago, bool anular)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _p.UpdateAsync(idRol, idPago, observacion, pago, anular);
            return Ok(res);

        }
    }
}
