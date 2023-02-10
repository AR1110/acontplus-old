using DataAccess.Estadisticas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Estadisticas
{
    public class EstadisticaCompraController : Controller
    {
        private readonly IConfiguration _configuration;
        private EstadisticaCompraDao _ec;
        public EstadisticaCompraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ec = new EstadisticaCompraDao(_configuration);
        }
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(string json) => Ok(await _ec.GetAsync(json));       
    }
}
