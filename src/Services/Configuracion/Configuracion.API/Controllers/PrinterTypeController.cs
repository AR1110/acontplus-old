using Configuracion.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Configuracion.API.Controllers
{
    public class PrinterTypeController : BaseApiController
    {
        private readonly ConfigContext _context;
        public PrinterTypeController(ConfigContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _context.PrinterTypes.ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
