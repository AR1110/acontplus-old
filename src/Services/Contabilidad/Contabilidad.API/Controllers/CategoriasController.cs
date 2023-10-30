using Contabilidad.Core.Entities;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common;

namespace Contabilidad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly ContabilidadContext _context;
        private readonly ISubCategoriaService _categoria;
        public CategoriasController(ContabilidadContext context, ISubCategoriaService categoria)
        {
            _context = context;
            _categoria = categoria;
        }

        // GET: api/Categorias
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        //{
        //    return await _context.Categorias.ToListAsync();
        //}
        [HttpGet]
        public async Task<IActionResult> GetCategorias(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json",  json}
                };
                var result = await _categoria.GetAsync(parameters);
                if (result == null) { return NoContent(); };
                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Error al traer las categorias");
            }
        }
        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound();
            }

            return categoria;
        }

        // PUT: api/Categorias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id)
            {
                return BadRequest();
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
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

        // POST: api/Categorias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            categoria.IdUsuario = User.GetUserId();
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategoria", new { id = categoria.Id }, categoria);
        }

        // DELETE: api/Categorias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }

            //_context.Categorias.Remove(categoria);
            //await _context.SaveChangesAsync();

            var pet = await _context.Categorias.FindAsync(id);
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
                if (!CategoriaExists(id))
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

        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.Id == id);
        }
    }
}
