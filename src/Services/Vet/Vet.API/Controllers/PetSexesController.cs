using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.Core.Entities;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    public class PetSexesController : BaseApiController
    {
        private readonly VetContext _context;

        public PetSexesController(VetContext context)
        {
            _context = context;
        }

        // GET: api/PetSexes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetSex>>> GetPetSexs()
        {
            return await _context.PetSexs.ToListAsync();
        }

        // GET: api/PetSexes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PetSex>> GetPetSex(int id)
        {
            var petSex = await _context.PetSexs.FindAsync(id);

            if (petSex == null)
            {
                return NotFound();
            }

            return petSex;
        }

        // PUT: api/PetSexes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPetSex(int id, PetSex petSex)
        {
            if (id != petSex.Id)
            {
                return BadRequest();
            }

            _context.Entry(petSex).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PetSexExists(id))
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

        // POST: api/PetSexes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PetSex>> PostPetSex(PetSex petSex)
        {
            _context.PetSexs.Add(petSex);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPetSex", new { id = petSex.Id }, petSex);
        }

        // DELETE: api/PetSexes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePetSex(int id)
        {
            var petSex = await _context.PetSexs.FindAsync(id);
            if (petSex == null)
            {
                return NotFound();
            }

            _context.PetSexs.Remove(petSex);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PetSexExists(int id)
        {
            return _context.PetSexs.Any(e => e.Id == id);
        }
    }
}
