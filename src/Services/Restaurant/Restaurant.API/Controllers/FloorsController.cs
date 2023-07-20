using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Infrastructure.Data;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FloorsController : ControllerBase
    {
        private readonly RestaurantContext _context;

        public FloorsController(RestaurantContext context)
        {
            _context = context;
        }

        // GET: api/Floors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Floor>>> GetFloors()
        {
            return await _context.Floors.ToListAsync();
        }

        // GET: api/Floors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Floor>> GetFloor(int id)
        {
            var floor = await _context.Floors.FindAsync(id);

            if (floor == null)
            {
                return NotFound();
            }

            return floor;
        }

        // PUT: api/Floors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFloor(int id, Floor floor)
        {
            if (id != floor.Id)
            {
                return BadRequest();
            }

            _context.Entry(floor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FloorExists(id))
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

        // POST: api/Floors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Floor>> PostFloor(Floor floor)
        {
            if (string.IsNullOrWhiteSpace(floor.CodEstab))
            {
                return NoContent();
            }
            _context.Floors.Add(floor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFloor", new { id = floor.Id }, floor);
        }

        // DELETE: api/Floors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFloor(int id)
        {
            var floor = await _context.Floors.FindAsync(id);
            if (floor == null)
            {
                return NotFound();
            }

            _context.Floors.Remove(floor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FloorExists(int id)
        {
            return _context.Floors.Any(e => e.Id == id);
        }
    }
}
