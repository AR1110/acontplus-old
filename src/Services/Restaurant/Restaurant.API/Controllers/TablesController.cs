using Lib.Common.Api;
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
    public class TablesController : ControllerBase
    {
        private readonly RestaurantContext _context;
        private readonly IAppTableService _tableService;

        public TablesController(RestaurantContext context, IAppTableService tableService)
        {
            _context = context;
            _tableService = tableService;
        }

        // GET: api/Tables
        [HttpGet]
        public async Task<ActionResult<APIResponse>> GetTables(string json)
        {
            var data = new Dictionary<string, object> {
                {"userRoleId", User.GetUserRoleId()}, {"json", json}
            };

            return await _tableService.GetAsync(data);
            //return await _context.Tables.ToListAsync();
        }

        // GET: api/Tables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppTable>> GetTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);

            if (table == null)
            {
                return NotFound();
            }

            return table;
        }

        // PUT: api/Tables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTable(int id, AppTable table)
        {
            if (id != table.Id)
            {
                return BadRequest();
            }

            //_context.Entry(table).State = EntityState.Modified;

            var tableFounded = await _context.Tables.FindAsync(id);
            tableFounded.RoomId = table.RoomId;
            tableFounded.Capacity = table.Capacity;
            tableFounded.NumberTable = table.NumberTable;
            tableFounded.Description = table.Description;
            tableFounded.Enabled = table.Enabled;
            tableFounded.UpdatedAt = table.UpdatedAt;
            tableFounded.UserId = User.GetUserId();

            try
            {
                _context.Update(tableFounded);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TableExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(tableFounded);
        }

        // POST: api/Tables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AppTable>> PostTable(AppTable table)
        {
            table.UserId = User.GetUserId();
            _context.Tables.Add(table);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTable", new { id = table.Id }, table);
        }

        // DELETE: api/Tables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return NotFound();
            }

            //_context.Tables.Remove(table);

            table.Deleted = true;
            table.Enabled = false;
            _context.Entry(table).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TableExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok();
        }

        private bool TableExists(int id)
        {
            return _context.Tables.Any(e => e.Id == id);
        }
    }
}
