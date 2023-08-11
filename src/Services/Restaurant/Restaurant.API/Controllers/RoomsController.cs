using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Infrastructure.Data;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly RestaurantContext _context;

        public RoomsController(RestaurantContext context)
        {
            _context = context;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            return await _context.Rooms.ToListAsync();
        }

        // POST: api/Rooms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(Room room)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var roomExists = RoomExists(room.FloorId, room.Code);
            if (roomExists) return BadRequest("El código ya está en uso");


            try
            {
                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();
                return Ok("Ingresado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Rooms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, Room room)
        {
            if (id != room.Id) return BadRequest();

            var roomExists = RoomExistsUpdate(room.Id,room.FloorId, room.Code);
            if (roomExists) return BadRequest("El código ya está en uso por otro piso");

            var roomsNotExists = !RoomExists(room.Id);
            if (roomsNotExists) return NotFound("No se ha encontrado registro");

            try
            {
                _context.Entry(room).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Actualizado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar " + ex.Message);
            }
        }


        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var roomsExists = RoomExists(id);
            if (!roomsExists) return NotFound("No se ha encontrado registro");

            try
            {
                var floor = await _context.Rooms.FindAsync(id);
                floor.Deleted = true;
                floor.Enabled = false;
                _context.Entry(floor).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok("Eliminado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al eliminar " + ex);
            }
        }

        // Verify exists by id
        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }

        private bool RoomExists(int floorId, string code)
        {
            return _context.Rooms.Any(e => e.FloorId == floorId && e.Code == code);
        }

        private bool RoomExistsUpdate(int id, int floorId, string code)
        {
            return _context.Rooms.Any(e => e.Id == id && e.Code == code && e.FloorId != floorId);
        }
    }
}
