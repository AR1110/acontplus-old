using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lib.Common.Api;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly RestaurantContext _context;
        private readonly IAppRoomService _service;

        public RoomsController(RestaurantContext context, IAppRoomService service)
        {
            _context = context;
            _service = service;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", json }
                };
                var response = await _service.GetAsync(parameters);
                if (response == null) { return NoContent(); }

                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

       
        // PUT: api/Rooms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, Room room)
        {
            if (id != room.Id)
            {
                return BadRequest();
            }

            _context.Entry(room).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
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

        // POST: api/Rooms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Room>> Post([FromBody] ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _service.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
