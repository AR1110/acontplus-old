using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.Core.Entities;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BehaviorsController : ControllerBase
    {
        private readonly VetContext _context;

        public BehaviorsController(VetContext context)
        {
            _context = context;
        }

        // GET: api/Behaviors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Behavior>>> GetBehaviors()
        {
            return await _context.Behaviors.ToListAsync();
        }

        // GET: api/Behaviors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Behavior>> GetBehavior(int id)
        {
            var behavior = await _context.Behaviors.FindAsync(id);

            if (behavior == null)
            {
                return NotFound();
            }

            return behavior;
        }

        // PUT: api/Behaviors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBehavior(int id, Behavior behavior)
        {
            if (id != behavior.Id)
            {
                return BadRequest();
            }

            _context.Entry(behavior).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BehaviorExists(id))
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

        // POST: api/Behaviors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Behavior>> PostBehavior(Behavior behavior)
        {
            _context.Behaviors.Add(behavior);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBehavior", new { id = behavior.Id }, behavior);
        }

        // DELETE: api/Behaviors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBehavior(int id)
        {
            var behavior = await _context.Behaviors.FindAsync(id);
            if (behavior == null)
            {
                return NotFound();
            }

            _context.Behaviors.Remove(behavior);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BehaviorExists(int id)
        {
            return _context.Behaviors.Any(e => e.Id == id);
        }
    }
}
