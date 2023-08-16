using Inventario.Core.Entities;
using Inventario.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MotivoDiscrepanciasController : ControllerBase
    {
        private readonly InventarioContext _context;

        public MotivoDiscrepanciasController(InventarioContext context)
        {
            _context = context;
        }

        // GET: api/MotivoDiscrepancias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MotivoDiscrepancia>>> GetMotivoDiscrepancias()
        {
            if (_context.MotivoDiscrepancias == null)
            {
                return NotFound();
            }
            try
            {
                return await _context.MotivoDiscrepancias.ToListAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/MotivoDiscrepancias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MotivoDiscrepancia>> GetMotivoDiscrepancia(int id)
        {
            if (_context.MotivoDiscrepancias == null)
            {
                return NotFound();
            }
            var motivoDiscrepancia = await _context.MotivoDiscrepancias.FindAsync(id);

            if (motivoDiscrepancia == null)
            {
                return NotFound();
            }

            return motivoDiscrepancia;
        }

        // PUT: api/MotivoDiscrepancias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMotivoDiscrepancia(int id, MotivoDiscrepancia motivoDiscrepancia)
        {
            if (id != motivoDiscrepancia.Id)
            {
                return BadRequest();
            }

            _context.Entry(motivoDiscrepancia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MotivoDiscrepanciaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MotivoDiscrepancias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MotivoDiscrepancia>> PostMotivoDiscrepancia(MotivoDiscrepancia motivoDiscrepancia)
        {
            if (_context.MotivoDiscrepancias == null)
            {
                return Problem("Entity set 'InventarioContext.MotivoDiscrepancias'  is null.");
            }

            _context.MotivoDiscrepancias.Add(motivoDiscrepancia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMotivoDiscrepancia", new { id = motivoDiscrepancia.Id }, motivoDiscrepancia);
        }

        // DELETE: api/MotivoDiscrepancias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMotivoDiscrepancia(int id)
        {
            if (_context.MotivoDiscrepancias == null)
            {
                return NotFound();
            }
            var motivoDiscrepancia = await _context.MotivoDiscrepancias.FindAsync(id);
            if (motivoDiscrepancia == null)
            {
                return NotFound();
            }

            //_context.MotivoDiscrepancias.Remove(motivoDiscrepancia);
            motivoDiscrepancia.Enabled = false;
            motivoDiscrepancia.Deleted = true;
            _context.Entry(motivoDiscrepancia).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                if (!MotivoDiscrepanciaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        private bool MotivoDiscrepanciaExists(int id)
        {
            return (_context.MotivoDiscrepancias?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
