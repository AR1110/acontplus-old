using Common.Infrastructure.Repository.GestionFinanciera;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Financiero
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
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _pagoD.GetByDocumentAsync(idRol, idPago, idTipoDocumento, idComprobante);
            return Ok(res);
        }
    }
}
