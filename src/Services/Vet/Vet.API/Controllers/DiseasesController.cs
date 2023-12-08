using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.API.Data;
using Vet.API.Entities;



namespace Vet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiseasesController : ControllerBase
    {
        private readonly VetContext _context;

        public DiseasesController(VetContext context)
        {
            _context = context;
        }

        // GET: api/Diseases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Disease>>> GetDiseases()
        {
            return await _context.Diseases.ToListAsync();
        }

        // GET: api/Diseases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Disease>> GetDisease(int id)
        {
            var disease = await _context.Diseases.FindAsync(id);

            if (disease == null)
            {
                return NotFound();
            }

            return disease;
        }

        // PUT: api/Diseases/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDisease(int id, Disease disease)
        {
            if (id != disease.Id)
            {
                return BadRequest();
            }

            _context.Entry(disease).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiseaseExists(id))
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

        // POST: api/Diseases
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Disease>> PostDisease(Disease disease)
        {
            _context.Diseases.Add(disease);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDisease", new { id = disease.Id }, disease);
        }

        // DELETE: api/Diseases/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDisease(int id)
        {
            var disease = await _context.Diseases.FindAsync(id);
            if (disease == null)
            {
                return NotFound();
            }

            _context.Diseases.Remove(disease);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DiseaseExists(int id)
        {
            return _context.Diseases.Any(e => e.Id == id);
        }
    }
}
