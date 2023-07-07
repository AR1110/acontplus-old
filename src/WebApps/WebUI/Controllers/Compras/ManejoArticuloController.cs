using DataAccess.Compras;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Compras
{
    public class ManejoArticuloController : Controller
    {
        private readonly IConfiguration _configuration;

        private ManejoArticuloDao _ma;
        public ManejoArticuloController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ma = new ManejoArticuloDao(_configuration);
        }
        public async Task<IActionResult> GetTagByDocument(int idArticulo, int idTipoDoc, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ma.GetByDocumentPayAsycn(idRol, idArticulo, idTipoDoc, idComprobante);
            return Ok(res);
        }
    }
}
