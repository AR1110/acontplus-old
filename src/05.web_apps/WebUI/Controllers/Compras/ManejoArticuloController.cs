using DataAccess.Compras;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Compras
{
    public class ManejoArticuloController : Controller
    {
        readonly ManejoArticuloDao _ma = new();


        public async Task<IActionResult> GetTagByDocument(int idArticulo, int idTipoDoc, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _ma.GetByDocumentPayAsycn(idRol, idArticulo, idTipoDoc, idComprobante);
            return Ok(res);
        }
    }
}
