namespace Vet.API.Controllers;

public class BehaviorTestsController : BaseApiController
{
    private readonly VetContext _context;

    public BehaviorTestsController(VetContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BehaviorTest>>> GetBehaviorTests()
    {
        return await _context.BehaviorTests.ToListAsync();
    }

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

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBehaviorTest(int id, BehaviorTest behaviorTest)
    {
        if (id != behaviorTest.Id)
        {
            return BadRequest();
        }

        var test = await _context.BehaviorTests.FindAsync(id);
        test.BehaviorId = behaviorTest.BehaviorId;
        test.BehaviorStatusId = behaviorTest.BehaviorStatusId;
        test.UpdatedAt = DateTime.Now;

        _context.Update(test);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<BehaviorTest>> PostBehaviorTest(BehaviorTest behaviorTest)
    {
        _context.BehaviorTests.Add(behaviorTest);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetBehaviorTest", new { id = behaviorTest.Id }, behaviorTest);
    }

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

        return Ok();
    }

    private bool BehaviorTestExists(int id)
    {
        return _context.BehaviorTests.Any(e => e.Id == id);
    }
}
