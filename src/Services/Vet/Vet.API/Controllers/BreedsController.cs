namespace Vet.API.Controllers
{
    public class BreedsController : BaseApiController
    {
        private readonly VetContext _context;

        public BreedsController(VetContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Breed>>> GetBreeds()
        {
            return await _context.Breeds.Include(t => t.PetType).Where(x => x.Deleted == null).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Breed>> GetBreed(int id)
        {
            var petBreed = await _context.Breeds.FindAsync(id);

            if (petBreed == null)
            {
                return NotFound();
            }

            return petBreed;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBreed(int id, Breed petBreed)
        {
            if (id != petBreed.Id)
            {
                return BadRequest();
            }

            var breedFounded = await _context.Breeds.FindAsync(id);
            breedFounded.PetTypeId = petBreed.PetTypeId;
            breedFounded.Code = petBreed.Code;
            breedFounded.Name = petBreed.Name;
            breedFounded.Description = petBreed.Description;
            breedFounded.UpdatedAt = DateTime.Now;

            _context.Update(breedFounded);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<Breed>> PostBreed(Breed petBreed)
        {
            _context.Breeds.Add(petBreed);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBreed", new { id = petBreed.Id }, petBreed);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBreed(int id)
        {
            var petBreed = await _context.Breeds.FindAsync(id);
            if (petBreed == null)
            {
                return NotFound();
            }

            petBreed.Deleted = true;
            petBreed.Enabled = false;
            _context.Entry(petBreed).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool BreedExists(int id)
        {
            return _context.Breeds.Any(e => e.Id == id);
        }
    }
}
