namespace Vet.API.Controllers;

public class DiseaseStatusController : BaseApiController
{
    private readonly VetContext _context;

    public DiseaseStatusController(VetContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DiseaseStatus>>> GetDiseaseStatuses()
    {
        return await _context.DiseaseStatuses.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DiseaseStatus>> GetDiseaseStatus(int id)
    {
        var diseaseStatus = await _context.DiseaseStatuses.FindAsync(id);

        if (diseaseStatus == null)
        {
            return NotFound();
        }

        return diseaseStatus;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutDiseaseStatus(int id, DiseaseStatus diseaseStatus)
    {
        if (id != diseaseStatus.Id)
        {
            return BadRequest();
        }

        _context.Entry(diseaseStatus).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<DiseaseStatus>> PostDiseaseStatus(DiseaseStatus diseaseStatus)
    {
        _context.DiseaseStatuses.Add(diseaseStatus);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetDiseaseStatus", new { id = diseaseStatus.Id }, diseaseStatus);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDiseaseStatus(int id)
    {
        var diseaseStatus = await _context.DiseaseStatuses.FindAsync(id);
        if (diseaseStatus == null)
        {
            return NotFound();
        }

        _context.DiseaseStatuses.Remove(diseaseStatus);
        await _context.SaveChangesAsync();

        return Ok();
    }

    private bool DiseaseStatusExists(int id)
    {
        return _context.DiseaseStatuses.Any(e => e.Id == id);
    }
}
