using DataAccess.GestionFinanciera;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.GestionFinanciera
{
    public class PagoDetalleController : Controller
    {
        PagoDetalleDao _pagoD = new();
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetByDocument(int idPago, int idTipoDocumento, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _pagoD.GetByDocumentAsync(idRol, idPago, idTipoDocumento, idComprobante);
            return Ok(res);
        }
    }
}
