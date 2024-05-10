namespace Vet.API.Controllers;

public class BehaviorStatusController : BaseApiController
{
    private readonly VetContext _context;

    public BehaviorStatusController(VetContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BehaviorStatus>>> GetBehaviorStatuses()
    {
        return await _context.BehaviorStatuses.ToListAsync();
    }

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

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBehaviorStatus(int id, BehaviorStatus behaviorStatus)
    {
        if (id != behaviorStatus.Id)
        {
            return BadRequest();
        }

        _context.Entry(behaviorStatus).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<BehaviorStatus>> PostBehaviorStatus(BehaviorStatus behaviorStatus)
    {
        _context.BehaviorStatuses.Add(behaviorStatus);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetBehaviorStatus", new { id = behaviorStatus.Id }, behaviorStatus);
    }

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

        return Ok();
    }

    private bool BehaviorStatusExists(int id)
    {
        return _context.BehaviorStatuses.Any(e => e.Id == id);
    }
}
