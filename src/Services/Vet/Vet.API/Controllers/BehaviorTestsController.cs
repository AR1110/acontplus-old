using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Vet.Core.Entities;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BehaviorTestsController : ControllerBase
    {
        private readonly VetContext _context;

        public BehaviorTestsController(VetContext context)
        {
            _context = context;
        }

        // GET: api/BehaviorTests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BehaviorTest>>> GetBehaviorTests()
        {
            return await _context.BehaviorTests.ToListAsync();
        }

        // GET: api/BehaviorTests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BehaviorTest>> GetBehaviorTest(int id)
        {
            var behaviorTest = await _context.BehaviorTests.FindAsync(id);

            if (behaviorTest == null)
            {
                return NotFound();
            }

            return behaviorTest;
        }

        // PUT: api/BehaviorTests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBehaviorTest(int id, BehaviorTest behaviorTest)
        {
            if (id != behaviorTest.Id)
            {
                return BadRequest();
            }

            //_context.Entry(behaviorTest).State = EntityState.Modified;
            var test = await _context.BehaviorTests.FindAsync(id);
            test.BehaviorId = behaviorTest.BehaviorId;
            test.BehaviorStatusId = behaviorTest.BehaviorStatusId;
            test.UpdatedAt = DateTime.Now;
            try
            {
                _context.Update(test);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BehaviorTestExists(id))
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

        // POST: api/BehaviorTests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BehaviorTest>> PostBehaviorTest(BehaviorTest behaviorTest)
        {
            _context.BehaviorTests.Add(behaviorTest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBehaviorTest", new { id = behaviorTest.Id }, behaviorTest);
        }

        // DELETE: api/BehaviorTests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBehaviorTest(int id)
        {
            var behaviorTest = await _context.BehaviorTests.FindAsync(id);
            if (behaviorTest == null)
            {
                return NotFound();
            }

            _context.BehaviorTests.Remove(behaviorTest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BehaviorTestExists(int id)
        {
            return _context.BehaviorTests.Any(e => e.Id == id);
        }
    }
}
