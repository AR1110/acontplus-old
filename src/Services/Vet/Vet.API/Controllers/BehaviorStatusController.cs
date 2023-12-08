using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.API.Data;
using Vet.API.Entities;



namespace Vet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BehaviorStatusController : ControllerBase
    {
        private readonly VetContext _context;

        public BehaviorStatusController(VetContext context)
        {
            _context = context;
        }

        // GET: api/BehaviorStatus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BehaviorStatus>>> GetBehaviorStatuses()
        {
            return await _context.BehaviorStatuses.ToListAsync();
        }

        // GET: api/BehaviorStatus/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BehaviorStatus>> GetBehaviorStatus(int id)
        {
            var behaviorStatus = await _context.BehaviorStatuses.FindAsync(id);

            if (behaviorStatus == null)
            {
                return NotFound();
            }

            return behaviorStatus;
        }

        // PUT: api/BehaviorStatus/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBehaviorStatus(int id, BehaviorStatus behaviorStatus)
        {
            if (id != behaviorStatus.Id)
            {
                return BadRequest();
            }

            _context.Entry(behaviorStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BehaviorStatusExists(id))
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

        // POST: api/BehaviorStatus
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BehaviorStatus>> PostBehaviorStatus(BehaviorStatus behaviorStatus)
        {
            _context.BehaviorStatuses.Add(behaviorStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBehaviorStatus", new { id = behaviorStatus.Id }, behaviorStatus);
        }

        // DELETE: api/BehaviorStatus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBehaviorStatus(int id)
        {
            var behaviorStatus = await _context.BehaviorStatuses.FindAsync(id);
            if (behaviorStatus == null)
            {
                return NotFound();
            }

            _context.BehaviorStatuses.Remove(behaviorStatus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BehaviorStatusExists(int id)
        {
            return _context.BehaviorStatuses.Any(e => e.Id == id);
        }
    }
}
