using DataAccess.Aplicacion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Api
{
    [AllowAnonymous]
    [Route("apiCliente/[controller]")]
    [ApiController]
    public class PlanClienteController : ControllerBase
    {
        private readonly ILogger<PlanClienteController> _logger;
        readonly PlanClienteDao _pcl = new();
        public PlanClienteController(ILogger<PlanClienteController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Route("Put/{ruc}/{codigo}")]
        public async Task<IActionResult> Put(string ruc, string codigo)
        {
            return Ok(await _pcl.UpdateAsync(ruc, codigo));
        }
    }
}
