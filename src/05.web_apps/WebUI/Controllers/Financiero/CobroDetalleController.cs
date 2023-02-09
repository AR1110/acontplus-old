using DataAccess.Tesoreria;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.GestionFinanciera
{
    public class CobroDetalleController : Controller
    {
        CobroDetalleDao _cd = new();
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetByIdCobro(int idCobro, int idTipoDoc, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cd.GetByDocumentAsync(idRol, idCobro, idTipoDoc, idComprobante);
            return Ok(res);
        }

        public async Task<IActionResult> GetByCobro(int idCobro)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cd.GetByCobroAsync(idRol, idCobro);
            return Ok(res);
        }
    }
}
