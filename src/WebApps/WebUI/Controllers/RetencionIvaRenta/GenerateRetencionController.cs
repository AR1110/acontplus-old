using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.RetencionIvaRenta
{
    public class GenerateRetencionController : Controller
    {
        private readonly IConfiguration _configuration;
        private GenerateRetencionDao _gr;
        public GenerateRetencionController(IConfiguration configuration)
        {
            _configuration = configuration;
            _gr = new GenerateRetencionDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }
         

        //Generar Retencion Venta Automatica 
        public async Task<IActionResult> GetGenerateRetencionVenta(int idTipoDoc, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gr.GetSaleAsync(idRol, idTipoDoc, idComprobante);
            return Ok(res);

        } 


    }
}
