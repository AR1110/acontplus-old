using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common.Logs;
using TechnicalSupport.API.Data;

namespace TechnicalSupport.API.Controllers
{
    public class OrderStatusController : BaseApiController
    {
        private readonly TechnicalSupportContext _context;
        private readonly LogWriter _log;
        public OrderStatusController(TechnicalSupportContext context, LogWriter log)
        {
            _context = context;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                if (!_context.Categories.Any())
                {
                    return NoContent();
                }
                return Ok(await _context.OrderStatuses.ToListAsync());
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: " + ex.Message);
                return BadRequest("Error on get");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Put(int id)
        {
            try
            {
                var status = await _context.OrderStatuses.FindAsync(id);
                if (status == null)
                {
                    return NotFound("No se encontro dicho estado");
                }

                status.Enabled = false;
                status.Deleted = true;
                _context.Entry(status).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Eliminada Exitosamente");
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Delete: " + ex.Message);
                return BadRequest("Error on Delete");
            }
        }
    }
}
