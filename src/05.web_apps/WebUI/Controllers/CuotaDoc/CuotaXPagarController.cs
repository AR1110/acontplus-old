using DataAccess.CuotaDocumento;
using Domain.Models.CuotaDocumento;
using Domain.ViewModels.CuotaDocumento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace WebUI.Controllers.CuotaDoc
{
    public class CuotaXPagarController : Controller
    {
        private readonly IConfiguration _configuration;

        private CuotaXPagarDao _cxp;
        public CuotaXPagarController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cxp = new CuotaXPagarDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Post([FromBody] CuotaXPagarViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cxp.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idComprobante, int idTipDoc, [FromBody] List<CuotaXPagar> data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cxp.UpdateAsync(idRol, idComprobante, idTipDoc, data);
            return Ok(res);
        }

        public async Task<IActionResult> GetByDocument(int idComprobante, int idTipoDoc)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cxp.GetByDocumentAsync(idRol, idComprobante, idTipoDoc);
            return Ok(res);
        }


        public async Task<IActionResult> GetForPay(int idComprobante, int idTipoDocumento)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cxp.GetByPagoAsync(idRol, idComprobante, idTipoDocumento);
            return Ok(res);
        }

       
    }
}
