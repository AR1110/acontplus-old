using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.API.Data;
using Vet.API.Entities;



namespace Vet.API.Controllers
{
    public class GenderesController : BaseApiController
    {
        private readonly VetContext _context;

        public GenderesController(VetContext context)
        {
            _context = context;
        }

        // GET: api/Genderes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gender>>> GetGenders()
        {
            return await _context.Genders.ToListAsync();
        }

        // GET: api/Genderes/5
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

        // PUT: api/Genderes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGender(int id, Gender petSex)
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
                if (!GenderExists(id))
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

        // POST: api/Genderes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Gender>> PostGender(Gender petSex)
        {
            _context.Genders.Add(petSex);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGender", new { id = petSex.Id }, petSex);
        }

        // DELETE: api/Genderes/5
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

            return NoContent();
        }

        private bool GenderExists(int id)
        {
            return _context.Genders.Any(e => e.Id == id);
        }
    }
}
