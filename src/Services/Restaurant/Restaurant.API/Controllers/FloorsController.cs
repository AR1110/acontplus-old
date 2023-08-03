using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lib.Common.Api;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Application.Services;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FloorsController : ControllerBase
    {
        private readonly RestaurantContext _context;
        private readonly IAppFloorService _floorService;

        public FloorsController(RestaurantContext context, IAppFloorService floorService)
        {
            _context = context;
            _floorService = floorService;
        }

        // GET: api/Floors
        [HttpGet]
        public async Task<ActionResult> GetFloors(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", json }
                };

                var response = await _floorService.GetAsync(parameters);
                if (response == null) { return NoContent(); }

                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFloor(int id, Floor floor)
        {
            if (id != floor.Id)
            {
                return BadRequest("No se ha logrado obtener el Id");
            }
            _context.Entry(floor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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
            return NoContent();
        }

        // POST: api/Floors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostFloor(ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _floorService.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Floors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFloor(int id)
        {
            var floor = await _context.Floors.FindAsync(id);
            if (floor == null)
            {
                return NotFound();
            }

            _context.Floors.Remove(floor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FloorExists(int id)
        {
            return _context.Floors.Any(e => e.Id == id);
        }
    }
}
