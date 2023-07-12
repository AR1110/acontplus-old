using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.Core.Entities;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    public class BreedsController : BaseApiController
    {
        private readonly VetContext _context;

        public BreedsController(VetContext context)
        {
            _context = context;
        }

        // GET: api/Breeds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Breed>>> GetBreeds()
        {
            return await _context.Breeds.ToListAsync();
        }

        // GET: api/Breeds/5
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

        // PUT: api/Breeds/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBreed(int id, Breed petBreed)
        {
            if (id != petBreed.Id)
            {
                return BadRequest();
            }

            _context.Entry(petBreed).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BreedExists(id))
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

        // POST: api/Breeds
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Breed>> PostBreed(Breed petBreed)
        {
            _context.Breeds.Add(petBreed);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBreed", new { id = petBreed.Id }, petBreed);
        }

        // DELETE: api/Breeds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBreed(int id)
        {
            var petBreed = await _context.Breeds.FindAsync(id);
            if (petBreed == null)
            {
                return NotFound();
            }

            _context.Breeds.Remove(petBreed);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BreedExists(int id)
        {
            return _context.Breeds.Any(e => e.Id == id);
        }
    }
}
