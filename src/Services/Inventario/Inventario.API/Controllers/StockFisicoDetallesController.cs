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
    public class StockFisicoDetallesController : ControllerBase
    {
        private readonly InventarioContext _context;

        public StockFisicoDetallesController(InventarioContext context)
        {
            _context = context;
        }

        // GET: api/StockFisicoDetalles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockFisicoDetalle>>> GetStockFisicoDetalles()
        {
          if (_context.StockFisicoDetalles == null)
          {
              return NotFound();
          }
            return await _context.StockFisicoDetalles.ToListAsync();
        }

        // GET: api/StockFisicoDetalles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StockFisicoDetalle>> GetStockFisicoDetalle(int id)
        {
          if (_context.StockFisicoDetalles == null)
          {
              return NotFound();
          }
            var stockFisicoDetalle = await _context.StockFisicoDetalles.FindAsync(id);

            if (stockFisicoDetalle == null)
            {
                return NotFound();
            }

            return stockFisicoDetalle;
        }

        // PUT: api/StockFisicoDetalles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStockFisicoDetalle(int id, StockFisicoDetalle stockFisicoDetalle)
        {
            if (id != stockFisicoDetalle.Id)
            {
                return BadRequest();
            }

            _context.Entry(stockFisicoDetalle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StockFisicoDetalleExists(id))
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

        // POST: api/StockFisicoDetalles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StockFisicoDetalle>> PostStockFisicoDetalle(StockFisicoDetalle stockFisicoDetalle)
        {
          if (_context.StockFisicoDetalles == null)
          {
              return Problem("Entity set 'InventarioContext.StockFisicoDetalles'  is null.");
          }
            _context.StockFisicoDetalles.Add(stockFisicoDetalle);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStockFisicoDetalle", new { id = stockFisicoDetalle.Id }, stockFisicoDetalle);
        }

        // DELETE: api/StockFisicoDetalles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockFisicoDetalle(int id)
        {
            if (_context.StockFisicoDetalles == null)
            {
                return NotFound();
            }
            var stockFisicoDetalle = await _context.StockFisicoDetalles.FindAsync(id);
            if (stockFisicoDetalle == null)
            {
                return NotFound();
            }

            _context.StockFisicoDetalles.Remove(stockFisicoDetalle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StockFisicoDetalleExists(int id)
        {
            return (_context.StockFisicoDetalles?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
