using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Inventario.Core.Entities;
using Inventario.Infrastructure.Data;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockFisicoController : ControllerBase
    {
        private readonly InventarioContext _context;

        public StockFisicoController(InventarioContext context)
        {
            _context = context;
        }

        // GET: api/StockFisico
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockFisico>>> GetStockFisicos()
        {
          if (_context.StockFisicos == null)
          {
              return NotFound();
          }
            return await _context.StockFisicos.ToListAsync();
        }

        // GET: api/StockFisico/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StockFisico>> GetStockFisico(int id)
        {
          if (_context.StockFisicos == null)
          {
              return NotFound();
          }
            var stockFisico = await _context.StockFisicos.FindAsync(id);

            if (stockFisico == null)
            {
                return NotFound();
            }

            return stockFisico;
        }

        // PUT: api/StockFisico/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStockFisico(int id, StockFisico stockFisico)
        {
            if (id != stockFisico.Id)
            {
                return BadRequest();
            }

            _context.Entry(stockFisico).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StockFisicoExists(id))
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

        // POST: api/StockFisico
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StockFisico>> PostStockFisico(StockFisico stockFisico)
        {
          if (_context.StockFisicos == null)
          {
              return Problem("Entity set 'InventarioContext.StockFisicos'  is null.");
          }
            _context.StockFisicos.Add(stockFisico);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStockFisico", new { id = stockFisico.Id }, stockFisico);
        }

        // DELETE: api/StockFisico/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockFisico(int id)
        {
            if (_context.StockFisicos == null)
            {
                return NotFound();
            }
            var stockFisico = await _context.StockFisicos.FindAsync(id);
            if (stockFisico == null)
            {
                return NotFound();
            }

            _context.StockFisicos.Remove(stockFisico);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StockFisicoExists(int id)
        {
            return (_context.StockFisicos?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
