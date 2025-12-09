namespace Inventory.Api.Controllers;

public class StockFisicoDetallesController(InventoryContext context) : BaseApiController
{
    // GET: api/StockFisicoDetalles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StockFisicoDetalle>>> GetStockFisicoDetalles()
    {
        return context.StockFisicoDetalles == null ? (ActionResult<IEnumerable<StockFisicoDetalle>>)NotFound() : (ActionResult<IEnumerable<StockFisicoDetalle>>)await context.StockFisicoDetalles.ToListAsync();
    }

    // GET: api/StockFisicoDetalles/5
    [HttpGet("{id}")]
    public async Task<ActionResult<StockFisicoDetalle>> GetStockFisicoDetalle(int id)
    {
        if (context.StockFisicoDetalles == null) return NotFound();

        var stockFisicoDetalle = await context.StockFisicoDetalles.FindAsync(id);

        return stockFisicoDetalle == null ? (ActionResult<StockFisicoDetalle>)NotFound() : (ActionResult<StockFisicoDetalle>)stockFisicoDetalle;
    }

    // PUT: api/StockFisicoDetalles/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutStockFisicoDetalle(int id, StockFisicoDetalle stockFisicoDetalle)
    {
        if (id != stockFisicoDetalle.Id) return BadRequest();

        context.Entry(stockFisicoDetalle).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StockFisicoDetalleExists(id)) return NotFound();

            throw;
        }

        return NoContent();
    }

    // POST: api/StockFisicoDetalles
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<StockFisicoDetalle>> PostStockFisicoDetalle(StockFisicoDetalle stockFisicoDetalle)
    {
        if (context.StockFisicoDetalles == null)
            return Problem("Entity set 'InventarioContext.StockFisicoDetalles'  is null.");

        context.StockFisicoDetalles.Add(stockFisicoDetalle);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetStockFisicoDetalle", new { id = stockFisicoDetalle.Id }, stockFisicoDetalle);
    }

    // DELETE: api/StockFisicoDetalles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStockFisicoDetalle(int id)
    {
        if (context.StockFisicoDetalles == null) return NotFound();

        var stockFisicoDetalle = await context.StockFisicoDetalles.FindAsync(id);
        if (stockFisicoDetalle == null) return NotFound();

        context.StockFisicoDetalles.Remove(stockFisicoDetalle);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool StockFisicoDetalleExists(int id)
    {
        return (context.StockFisicoDetalles?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}