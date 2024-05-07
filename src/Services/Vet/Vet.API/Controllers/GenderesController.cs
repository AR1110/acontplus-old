namespace Vet.API.Controllers
{
    public class GenderesController : BaseApiController
    {
        private readonly VetContext _context;

        public GenderesController(VetContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gender>>> GetGenders()
        {
            return await _context.Genders.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Gender>> GetGender(int id)
        {
            var petSex = await _context.Genders.FindAsync(id);

            if (petSex == null)
            {
                return NotFound();
            }

            return petSex;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutGender(int id, Gender petSex)
        {
            if (id != petSex.Id)
            {
                return BadRequest();
            }

            _context.Entry(petSex).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<Gender>> PostGender(Gender petSex)
        {
            _context.Genders.Add(petSex);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGender", new { id = petSex.Id }, petSex);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGender(int id)
        {
            var petSex = await _context.Genders.FindAsync(id);
            if (petSex == null)
            {
                return NotFound();
            }

            _context.Genders.Remove(petSex);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool GenderExists(int id)
        {
            return _context.Genders.Any(e => e.Id == id);
        }
    }
}
