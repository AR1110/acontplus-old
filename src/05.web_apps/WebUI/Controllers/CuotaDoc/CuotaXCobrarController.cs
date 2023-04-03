using DataAccess.CuotasXCobrar;
using Domain.Models.CuotaDocumento;
using Domain.ViewModels.CuotaDocumento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.CuotaDoc
{ 
    public class CuotaXCobrarController : Controller
    {
        private readonly IConfiguration _configuration;
        private CuotaXCobrarDao _cxc;

        public CuotaXCobrarController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cxc = new CuotaXCobrarDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Post([FromBody] CuotaXCobrarViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cxc.InsertAsync(idRol, data);
            return Ok(res); 
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idComprobante, int idTipDoc, [FromBody] List<CuotaXCobrar> data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cxc.UpdateAsync(idRol, idComprobante, idTipDoc, data);
            return Ok(res);
        }

        public async Task<IActionResult> GetByDocument(int idComprobante, int idTipoDoc)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cxc.GetByDocumentAsync(idRol, idComprobante, idTipoDoc);
            return Ok(res);
        }

        public async Task<IActionResult> GetCuotaForPayment(int idComprobante, int idTipoDocumento)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cxc.GetByCobroAsync(idRol, idComprobante, idTipoDocumento);
            return Ok(res);
        }

      

    }
}
