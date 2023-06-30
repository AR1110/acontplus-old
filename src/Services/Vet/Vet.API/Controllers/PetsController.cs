using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common;
using Vet.Core.Entities;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    public class PetsController : BaseApiController
    {
        private readonly VetContext _context;

        public PetsController(VetContext context)
        {
            _context = context;
        }

        // GET: api/Pet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pet>>> GetPets()
        {
            var companyId = User.GetCompanyId();
            return await _context.Pets
                .Include(t => t.PetType)
                .Include(b => b.PetBreed)
                .Include(s => s.PetSex)
                .Where(x => x.CompanyUniqueId == companyId)
                .ToListAsync();
        }

        // GET: api/Pet/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pet>> GetPet(int id)
        {
            var pet = await _context.Pets.FindAsync(id);

            if (pet == null)
            {
                return NotFound();
            }

            return pet;
        }

        // PUT: api/Pet/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPet(int id, Pet pet)
        {
            if (id != pet.Id)
            {
                return BadRequest();
            }

            _context.Entry(pet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PetExists(id))
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

        // POST: api/Pet
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Pet>> PostPet(Pet pet)
        {
            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPet", new { id = pet.Id }, pet);
        }

        // DELETE: api/Pet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePet(int id)
        {
            var pet = await _context.Pets.FindAsync(id);
            if (pet == null)
            {
                return NotFound();
            }

            // _context.Pets.Remove(pet);
            //await _context.SaveChangesAsync();
            pet.Deleted = true;
            _context.Entry(pet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PetExists(id))
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

        private bool PetExists(int id)
        {
            return _context.Pets.Any(e => e.Id == id);
        }
    }
}
