using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common.Logs;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Entities;

using TechnicalSupport.Infrastructure.Data;

namespace TechnicalSupport.API.Controllers
{
    public class CategoryController : BaseApiController
    {
        private readonly TechnicalSupportContext _context;
        private readonly LogWriter _log;
        public CategoryController(TechnicalSupportContext context, LogWriter log)
        {
            _context = context;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                if (!_context.Categories.Any())
                {
                    return NoContent();
                }
                return Ok(await _context.Categories.Where(x => x.Enabled == true).ToListAsync());
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: " + ex.Message);
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Category category)
        {
            try
            {
                if (_context.Categories.Any(c => c.Code == category.Code))
                {
                    return BadRequest("Codigo Existente");
                }
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return Ok("Registrado Exitosamente");
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: " + ex.Message);
                return BadRequest("Error on post");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Category category)
        {
            try
            {
                if (id != category.Id)
                {
                    return BadRequest("El id no coincide");
                }
                _context.Entry(category).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Actualizado Exitosamente");
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: " + ex.Message);
                return BadRequest("Error on post");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound();
                }

                category.Enabled = false;
                category.Deleted = true;
                _context.Entry(category).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Eliminada Exitosamente");
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Delete: " + ex.Message);
                return BadRequest("Error on Delete");
            }
        }
    }
}
