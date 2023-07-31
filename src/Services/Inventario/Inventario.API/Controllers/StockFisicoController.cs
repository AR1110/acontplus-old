using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Inventario.Core.Entities;
using Inventario.Infrastructure.Data;
using Inventario.Core.Interfaces;
using Services.Common;
using Lib.Common.Api;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockFisicoController : ControllerBase
    {
        private readonly InventarioContext _context;
        private readonly IStockFisicoService _stockFisico;
        public StockFisicoController(InventarioContext context, IStockFisicoService stockFisico)
        {
            _context = context;
            _stockFisico = stockFisico;
        }

        // GET: api/StockFisico
        [HttpGet]
        public async Task<IActionResult> GetStockFisicos(string json)
        {
            //if (_context.StockFisicos == null)
            //{
            //    return NotFound();
            //}
            //return await _context.StockFisicos.ToListAsync();
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", json}
                };
                var response = await _stockFisico.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
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
        public async Task<IActionResult> PostStockFisico(ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _stockFisico.AddAsync(request);
                return Ok(response);
            }
            catch (System.Exception ex)
            {

                return BadRequest();
            }
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
