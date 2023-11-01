using Common.Core.Utils;
using Inventario.Core.Interfaces;
using Inventario.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticuloFraccionadoController : ControllerBase
    {
        private readonly InventarioContext _context;
        private readonly IArticuloFraccionadoService _artSvc;
        public ArticuloFraccionadoController(InventarioContext context, IArticuloFraccionadoService artSvc)
        {
            _context = context;
            _artSvc = artSvc;
        }

        // GET: api/StockFisico
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        { 
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _artSvc.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

    }
}
