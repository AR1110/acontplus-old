using DataAccess.GestionFinanciera;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
{
    public class PagoDetalleController : Controller
    {
        private readonly IConfiguration _configuration;

        private PagoDetalleDao _pagoD;
        public PagoDetalleController(IConfiguration configuration)
        {
            _configuration = configuration;
            _pagoD = new PagoDetalleDao(_configuration);
        }

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
