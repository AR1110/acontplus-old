using Common.AppSettings.Extensions;

namespace Inventario.API.Controllers;

public class StockFisicoController(InventarioContext context, IStockFisicoService stockFisico) : BaseApiController
{
    // GET: api/StockFisico
    [HttpGet]
    public async Task<IActionResult> GetStockFisicos(string json)
    {
        //if (_context.StockFisicos == null)
        //{
        //    return NotFound();
        //}
        //return await _context.StockFisicos.ToListAsync();
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", json }
            };
            var response = await stockFisico.GetAsync(parameters);
            if (response == null) { return NoContent(); }

            return Ok(response);
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }

    // GET: api/StockFisico/5
    [HttpGet("{id}")]
    public async Task<ActionResult<StockFisico>> GetStockFisico(int id)
    {
        if (context.StockFisicos == null)
        {
            return NotFound();
        }

        var stockFisico = await context.StockFisicos.FindAsync(id);

        if (stockFisico == null)
        {
            return NotFound();
        }

        return stockFisico;
    }

    // PUT: api/StockFisico/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutStockFisico(int id, StockFisico stockFisico)
    {
        if (id != stockFisico.Id)
        {
            return BadRequest();
        }

        context.Entry(stockFisico).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StockFisicoExists(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    // POST: api/StockFisico
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<IActionResult> PostStockFisico(ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await stockFisico.AddAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE: api/StockFisico/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStockFisico(int id)
    {
        if (context.StockFisicos == null)
        {
            return NotFound();
        }

        var stockFisico = await context.StockFisicos.FindAsync(id);
        if (stockFisico == null)
        {
            return NotFound();
        }

        context.StockFisicos.Remove(stockFisico);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool StockFisicoExists(int id)
    {
        return (context.StockFisicos?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}
