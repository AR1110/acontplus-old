namespace Vet.API.Controllers;

public class BehaviorsController : BaseApiController
{
    private readonly VetContext _context;

    public BehaviorsController(VetContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Behavior>>> GetBehaviors()
    {
        return await _context.Behaviors.ToListAsync();
    }

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

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBehavior(int id, Behavior behavior)
    {
        if (id != behavior.Id)
        {
            return BadRequest();
        }

        _context.Entry(behavior).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<Behavior>> PostBehavior(Behavior behavior)
    {
        _context.Behaviors.Add(behavior);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetBehavior", new { id = behavior.Id }, behavior);
    }

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

        return Ok();
    }

    private bool BehaviorExists(int id)
    {
        return _context.Behaviors.Any(e => e.Id == id);
    }
}
