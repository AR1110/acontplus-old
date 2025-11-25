namespace Inventory.Api.Controllers;

public class MotivoDiscrepanciasController(InventoryContext context) : BaseApiController
{
    // GET: api/MotivoDiscrepancias
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MotivoDiscrepancia>>> GetMotivoDiscrepancias()
    {
        if (context.MotivoDiscrepancias == null) return NotFound();

        try
        {
            return await context.MotivoDiscrepancias.ToListAsync();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // GET: api/MotivoDiscrepancias/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MotivoDiscrepancia>> GetMotivoDiscrepancia(int id)
    {
        if (context.MotivoDiscrepancias == null) return NotFound();

        var motivoDiscrepancia = await context.MotivoDiscrepancias.FindAsync(id);

        return motivoDiscrepancia == null ? (ActionResult<MotivoDiscrepancia>)NotFound() : (ActionResult<MotivoDiscrepancia>)motivoDiscrepancia;
    }

    // PUT: api/MotivoDiscrepancias/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMotivoDiscrepancia(int id, MotivoDiscrepancia motivoDiscrepancia)
    {
        if (id != motivoDiscrepancia.Id) return BadRequest();

        context.Entry(motivoDiscrepancia).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MotivoDiscrepanciaExists(id)) return NotFound();

            throw;
        }

        return NoContent();
    }

    // POST: api/MotivoDiscrepancias
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<MotivoDiscrepancia>> PostMotivoDiscrepancia(MotivoDiscrepancia motivoDiscrepancia)
    {
        if (context.MotivoDiscrepancias == null)
            return Problem("Entity set 'InventarioContext.MotivoDiscrepancias'  is null.");

        context.MotivoDiscrepancias.Add(motivoDiscrepancia);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetMotivoDiscrepancia", new { id = motivoDiscrepancia.Id }, motivoDiscrepancia);
    }

    // DELETE: api/MotivoDiscrepancias/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMotivoDiscrepancia(int id)
    {
        if (context.MotivoDiscrepancias == null) return NotFound();

        var motivoDiscrepancia = await context.MotivoDiscrepancias.FindAsync(id);
        if (motivoDiscrepancia == null) return NotFound();

        //_context.MotivoDiscrepancias.Remove(motivoDiscrepancia);
        motivoDiscrepancia.IsActive = false;
        motivoDiscrepancia.IsDeleted = true;
        context.Entry(motivoDiscrepancia).State = EntityState.Modified;
        try
        {
            await context.SaveChangesAsync();
        }
        catch (Exception)
        {
            if (!MotivoDiscrepanciaExists(id)) return NotFound();

            throw;
        }

        return Ok();
    }

    private bool MotivoDiscrepanciaExists(int id)
    {
        return (context.MotivoDiscrepancias?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}