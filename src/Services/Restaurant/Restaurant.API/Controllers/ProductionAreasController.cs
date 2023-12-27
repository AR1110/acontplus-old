using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Infrastructure.Data;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductionAreasController : ControllerBase
    {
        private readonly RestaurantContext _context;

        public ProductionAreasController(RestaurantContext context)
        {
            _context = context;
        }

        // GET: api/ProductionAreas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductionArea>>> GetProductionAreas()
        {
            return await _context.ProductionAreas.Where(x => x.Deleted == null).ToListAsync();
        }

        // POST: api/ProductionAreas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductionArea>> PostProductionArea(ProductionArea productionArea)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var productionAreaExists = ProductionAreaExists(productionArea.Code);
            if (productionAreaExists) return BadRequest("El código ya está en uso");

            try
            {
                _context.ProductionAreas.Add(productionArea);
                await _context.SaveChangesAsync();
                return Ok("Ingresado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest("Error en ingresar " + ex.Message);
            }
        }

        // PUT: api/ProductionAreas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductionArea(int id, ProductionArea productionArea)
        {
            if (id != productionArea.Id) return BadRequest();

            var productionAreaExists = ProductionAreaExistsUpdate(productionArea.Id, productionArea.Code);
            if (productionAreaExists) return BadRequest("El código ya está en uso");


            try
            {
                _context.Entry(productionArea).State = EntityState.Modified;

                await _context.SaveChangesAsync();
                return Ok("Actualizado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest("Error en actualizar " + ex.Message);
            }
        }

        // DELETE: api/ProductionAreas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductionArea(int id)
        {
            var productionArea = await _context.ProductionAreas.FindAsync(id);
            if (productionArea == null) return NotFound("No se ha encontrado registro");

            try
            {
                productionArea.Deleted = true;
                productionArea.Enabled = false;
                productionArea.UpdatedAt = DateTime.Now;
                _context.Update(productionArea);
                await _context.SaveChangesAsync();
                return Ok("Eliminado exitosamente");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al eliminar " + ex);
            }
        }

        private bool ProductionAreaExists(string code)
        {
            return _context.ProductionAreas.Any(e => e.Code == code);
        }

        private bool ProductionAreaExistsUpdate(int id, string code)
        {
            return _context.ProductionAreas.Any(e => e.Id != id && e.Code == code);
        }
    }
}
