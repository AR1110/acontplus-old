using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Infrastructure.Data;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly RestaurantContext _context;

        public TablesController(RestaurantContext context)
        {
            _context = context;
        }

        // GET: api/AppTables
        [HttpGet("Get")]
        public async Task<ActionResult<IEnumerable<AppTable>>> GetTables()
        {
            return await _context.Tables.Include(x => x.Room).ToListAsync();
        }
            
        [HttpGet("GetByCode/{codEstab}")]
        public async Task<ActionResult<IEnumerable<AppTable>>> GetByCode(string codEstab)
        {
            return await _context.Tables.Include(x => x.Room).Where(x => x.Room.Floor.CodEstab == codEstab).ToListAsync();
        }

        // POST: api/AppTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AppTable>> PostAppTable(AppTable appTable)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            appTable.UserId = User.GetUserId();
            try
            {
                _context.Tables.Add(appTable);
                await _context.SaveChangesAsync();
                return Ok("Ingresado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al ingresar" + ex);
            }
        }

        // PUT: api/AppTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTable(int id, AppTable appTable)
        {
            if (id != appTable.Id) return BadRequest();

            var tableExist = TableExists(appTable.Id);
            if (!tableExist) return BadRequest("No se encontró registro");

            appTable.UserId = User.GetUserId();
            try
            {
                _context.Entry(appTable).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Actualizado exitosamente");

            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar" + ex);
            }
        }

        // DELETE: api/AppTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var tables = TableExists(id);
            if (!tables) return BadRequest("No se encontró registro");

            try
            {
                var table = await _context.Tables.FindAsync(id);
                table.Deleted = true;
                table.Enabled = false;
                table.UserId = User.GetUserId();

                _context.Entry(table).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Eliminado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al eliminar" + ex);
            }
        }

        private bool TableExists(int id)
        {
            return _context.Tables.Any(e => e.Id == id);
        }
    }
}
