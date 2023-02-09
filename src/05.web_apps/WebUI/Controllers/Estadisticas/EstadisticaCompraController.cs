using DataAccess.Estadisticas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Estadisticas
{
    public class EstadisticaCompraController : Controller
    {
        private readonly EstadisticaCompraDao _ec = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(string json) => Ok(await _ec.GetAsync(json));       
    }
}
