using DataAccess.Estadisticas;
using Microsoft.AspNetCore.Mvc;
namespace WebUI.Controllers.Estadisticas
{
    public class EstadisticaVentaController : Controller
    {
        private readonly EstadisticaVentaDao _ev = new();
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _ev.GetAsync(json));
        }

        public async Task<IActionResult> GetClienteVenta(string json){
           return Ok(await _ev.GetClienteVentaAsync(json));
       }
        
    }
}
