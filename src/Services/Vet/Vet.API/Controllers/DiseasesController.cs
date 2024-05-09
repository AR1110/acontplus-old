namespace Vet.API.Controllers
{
    public class DiseasesController : BaseApiController
    {
        private readonly VetContext _context;

        public DiseasesController(VetContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Disease>>> GetDiseases()
        {
            return await _context.Diseases.ToListAsync();
        }

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

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDisease(int id, Disease disease)
        {
            if (id != disease.Id)
            {
                return BadRequest();
            }

            _context.Entry(disease).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<Disease>> PostDisease(Disease disease)
        {
            _context.Diseases.Add(disease);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDisease", new { id = disease.Id }, disease);
        }

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

            return Ok();
        }

        private bool DiseaseExists(int id)
        {
            return _context.Diseases.Any(e => e.Id == id);
        }
    }
}
