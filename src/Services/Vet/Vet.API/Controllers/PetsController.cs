using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common;
using Vet.API.Data;
using Vet.API.Entities;
using Vet.API.Interfaces;
namespace Vet.API.Controllers
{
    public class PetsController : BaseApiController
    {
        private readonly VetContext _context;
        private readonly IPetService _petService;

        public PetsController(VetContext context, IPetService petService)
        {
            _context = context;
            _petService = petService;
        }

        // GET: api/Pet
        [HttpGet]
        public async Task<ActionResult<ApiResponse>> GetPets(string json)
        {
            int companyId = Convert.ToInt32(User.GetCompanyId());
            if (!_context.Pets.Any(x => x.CompanyId == companyId))
            {
                return NoContent();
            }
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    { "companyId", companyId },
                    { "json", json}
                };

                return await _petService.GetAsync(parameters);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al buscar las mascotas:" + ex.Message);
            }
            //return await _context.Pets
            //    .Include(t => t.PetType)
            //    .Include(b => b.Breed)
            //    .Include(s => s.Gender)
            //    .Where(x => x.CompanyId == companyId
            //    && x.Deleted == null
            //    )
            //    .ToListAsync();
        }
        // GET: api/Pet
        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse>> Search(string json)
        {
            int companyId = Convert.ToInt32(User.GetCompanyId());
            if (!_context.Pets.Any(x => x.CompanyId == companyId))
            {
                //return NoContent();
            }
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    { "companyId", companyId },
                    { "json", json}
                };

                return await _petService.SearchAsync(parameters);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al buscar las mascotas:" + ex.Message);
            }
            //return await _context.Pets
            //    .Include(t => t.PetType)
            //    .Include(b => b.Breed)
            //    .Include(s => s.Gender)
            //    .Where(x =>
            //            x.Enabled &&
            //            x.CompanyId == companyId
            //            && (x.Name.Contains(textSearch))
            //     )
            //    .ToListAsync();
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

            var petFounded = await _context.Pets.FindAsync(id);
            petFounded.Name = pet.Name;
            petFounded.PetTypeId = pet.PetTypeId;
            petFounded.BreedId = pet.BreedId;
            petFounded.GenderId = pet.GenderId;
            //petFounded.Age = pet.Age;
            petFounded.Color = pet.Color;
            //petFounded.Weight = pet.Weight;
            petFounded.Enabled = pet.Enabled;
            petFounded.Weight = pet.Weight;
            petFounded.UpdatedAt = DateTime.Now;
            petFounded.UserId = User.GetUserId();
            try
            {
                _context.Update(petFounded);
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
            pet.UserId = User.GetUserId();
            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPet", new { id = pet.Id }, pet);
        }

        // DELETE: api/Pet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePet(int id)
        {
            // _context.Pets.Remove(pet);
            //await _context.SaveChangesAsync();

            var pet = await _context.Pets.FindAsync(id);
            if (pet == null)
            {
                return NotFound();
            }


            pet.Deleted = true;
            pet.Enabled = false;
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
