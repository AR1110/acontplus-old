using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using Restaurant.Infrastructure.Data.Migrations;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FloorsController : ControllerBase
    {
        private readonly RestaurantContext _context;

        public FloorsController(RestaurantContext context)
        {
            _context = context;
        }

        // GET: api/Floors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Floor>>> Get()
        {
            return await _context.Floors.ToListAsync();
        }

        // POST: api/Floors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Floor>> Post(Floor floor)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var floorExist = FloorExistsCodeEstab(floor.Code, floor.CodEstab);
            if (floorExist) return BadRequest("El código ya está en uso");

            try
            {
                _context.Floors.Add(floor);
                await _context.SaveChangesAsync();
                return Ok("Ingresado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Floor floor)
        {
            if (id != floor.Id) return BadRequest();

            var floorExist = FloorExistsCode(floor.Id, floor.CodEstab);
            if (floorExist) return BadRequest("El código ya está en uso");

            var floorNotExists = !FloorExists(id);
            if (floorNotExists) return NotFound("No existe registro");
           
            try
            {
                _context.Entry(floor).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Actualizado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar " + ex);
            }
        }

        // DELETE: api/Floors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFloor(int id)
        {
            var floor = await _context.Floors.FindAsync(id);
            if (floor == null) return NotFound();

            floor.Deleted = true;
            floor.Enabled = false;

            _context.Entry(floor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FloorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        private bool FloorExists(int id)
        {
            return _context.Floors.Any(e => e.Id == id);
        }

        private bool FloorExistsCodeEstab(string code, string codEstab)
        {
            return _context.Floors.Any(e => e.Code == code && e.CodEstab == codEstab);
        }

        private bool FloorExistsCode(int id, string code)
        {
            return _context.Floors.Any(e => e.Id != id && e.Code == code);  
        }
    }
}
