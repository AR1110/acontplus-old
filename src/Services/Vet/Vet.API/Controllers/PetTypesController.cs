namespace Vet.API.Controllers;

public class PetTypesController : BaseApiController
{
    private readonly VetContext _context;

    public PetTypesController(VetContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PetType>>> GetPetTypes()
    {
        return await _context.PetTypes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PetType>> GetPetType(int id)
    {
        var petType = await _context.PetTypes.FindAsync(id);

        if (petType == null)
        {
            return NotFound();
        }

        return petType;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutPetType(int id, PetType petType)
    {
        if (id != petType.Id)
        {
            return BadRequest();
        }

        _context.Entry(petType).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PetTypeExists(id))
            {
                return NotFound();
            }

            throw;
        }

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<PetType>> PostPetType(PetType petType)
    {
        _context.PetTypes.Add(petType);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPetType", new { id = petType.Id }, petType);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePetType(int id)
    {
        var petType = await _context.PetTypes.FindAsync(id);
        if (petType == null)
        {
            return NotFound();
        }

        _context.PetTypes.Remove(petType);
        await _context.SaveChangesAsync();

        return Ok();
    }

    private bool PetTypeExists(int id)
    {
        return _context.PetTypes.Any(e => e.Id == id);
    }
}
