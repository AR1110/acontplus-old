namespace TechnicalSupport.Api.Controllers;

public class OrderStatusController : BaseApiController
{
    private readonly TechnicalSupportContext _context;

    public OrderStatusController(TechnicalSupportContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return !_context.Categories.Any() ? NoContent() : Ok(await _context.OrderStatuses.ToListAsync());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var status = await _context.OrderStatuses.FindAsync(id);
        if (status == null) return NotFound("No se encontro dicho estado");

        status.IsActive = false;
        status.IsDeleted = true;
        _context.Entry(status).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok("Eliminada Exitosamente");
    }
}