using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.Core.Entities;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    public class PetBreedsController : BaseApiController
    {
        private readonly VetContext _context;

        public PetBreedsController(VetContext context)
        {
            _context = context;
        }

        // GET: api/PetBreeds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetBreed>>> GetPetBreeds()
        {
            return await _context.PetBreeds.ToListAsync();
        }

        // GET: api/PetBreeds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PetBreed>> GetPetBreed(int id)
        {
            var petBreed = await _context.PetBreeds.FindAsync(id);

            if (petBreed == null)
            {
                return NotFound();
            }

            return petBreed;
        }

        // PUT: api/PetBreeds/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPetBreed(int id, PetBreed petBreed)
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
                if (!PetBreedExists(id))
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

        // POST: api/PetBreeds
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PetBreed>> PostPetBreed(PetBreed petBreed)
        {
            _context.PetBreeds.Add(petBreed);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPetBreed", new { id = petBreed.Id }, petBreed);
        }

        // DELETE: api/PetBreeds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePetBreed(int id)
        {
            var petBreed = await _context.PetBreeds.FindAsync(id);
            if (petBreed == null)
            {
                return NotFound();
            }

            _context.PetBreeds.Remove(petBreed);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PetBreedExists(int id)
        {
            return _context.PetBreeds.Any(e => e.Id == id);
        }
    }
}
