using DataAccess.Tesoreria;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
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
