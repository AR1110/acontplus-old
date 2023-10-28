using DataAccess.GestionFinanciera;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Financiero
{
    public class CobroDetalleController : Controller
    {
        private readonly IConfiguration _configuration;

        private CobroDetalleDao _cd;
        public CobroDetalleController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cd = new CobroDetalleDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetByIdCobro(int idCobro, int idTipoDoc, int idComprobante)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cd.GetByDocumentAsync(idRol, idCobro, idTipoDoc, idComprobante);
            return Ok(res);
        }

        public async Task<IActionResult> GetByCobro(int idCobro)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _cd.GetByCobroAsync(idRol, idCobro);
            return Ok(res);
        }
    }
}
