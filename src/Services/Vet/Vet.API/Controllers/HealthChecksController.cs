namespace Vet.API.Controllers
{
    public class HealthChecksController : BaseApiController
    {
        private readonly VetContext _context;

        public HealthChecksController(VetContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HealthCheck>>> GetHealthChecks()
        {
            return await _context.HealthChecks.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HealthCheck>> GetHealthCheck(int id)
        {
            var healthCheck = await _context.HealthChecks.FindAsync(id);

            if (healthCheck == null)
            {
                return NotFound();
            }

            return healthCheck;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHealthCheck(int id, HealthCheck healthCheck)
        {
            if (id != healthCheck.Id)
            {
                return BadRequest();
            }

            var healthCheckFounded = await _context.HealthChecks.FindAsync(id);
            healthCheckFounded.DiseaseId = healthCheck.DiseaseId;
            healthCheckFounded.DiseaseStatusId = healthCheck.DiseaseStatusId;
            healthCheckFounded.UpdatedAt = DateTime.Now;

            _context.Update(healthCheckFounded);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<HealthCheck>> PostHealthCheck(HealthCheck healthCheck)
        {
            _context.HealthChecks.Add(healthCheck);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHealthCheck", new { id = healthCheck.Id }, healthCheck);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheck(int id)
        {
            var healthCheck = await _context.HealthChecks.FindAsync(id);
            if (healthCheck == null)
            {
                return NotFound();
            }

            _context.HealthChecks.Remove(healthCheck);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool HealthCheckExists(int id)
        {
            return _context.HealthChecks.Any(e => e.Id == id);
        }
    }
}
