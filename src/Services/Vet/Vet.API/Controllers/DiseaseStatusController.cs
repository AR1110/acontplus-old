using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.Core.Entities;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiseaseStatusController : ControllerBase
    {
        private readonly VetContext _context;

        public DiseaseStatusController(VetContext context)
        {
            _context = context;
        }

        // GET: api/DiseaseStatus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DiseaseStatus>>> GetDiseaseStatuses()
        {
            return await _context.DiseaseStatuses.ToListAsync();
        }

        // GET: api/DiseaseStatus/5
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

        // PUT: api/DiseaseStatus/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiseaseStatus(int id, DiseaseStatus diseaseStatus)
        {
            if (id != diseaseStatus.Id)
            {
                return BadRequest();
            }

            _context.Entry(diseaseStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiseaseStatusExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/DiseaseStatus
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DiseaseStatus>> PostDiseaseStatus(DiseaseStatus diseaseStatus)
        {
            _context.DiseaseStatuses.Add(diseaseStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDiseaseStatus", new { id = diseaseStatus.Id }, diseaseStatus);
        }

        // DELETE: api/DiseaseStatus/5
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

            return NoContent();
        }

        private bool DiseaseStatusExists(int id)
        {
            return _context.DiseaseStatuses.Any(e => e.Id == id);
        }
    }
}
