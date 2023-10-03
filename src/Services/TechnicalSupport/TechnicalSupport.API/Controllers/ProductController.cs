using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common;
using Services.Common.Logs;
using TechnicalSupport.Core.Entities;
using TechnicalSupport.Core.Interfaces;
using TechnicalSupport.Infrastructure.Data;

namespace TechnicalSupport.API.Controllers
{
    public class ProductController : BaseApiController
    {
        private readonly TechnicalSupportContext _context;
        private readonly LogWriter _log;
        private IProductService _productService;
        public ProductController(TechnicalSupportContext context, LogWriter log, IProductService productService)
        {
            _context = context;
            _log = log;
            _productService = productService;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _productService.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: " + ex.Message);
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Product product)
        {
            try
            {
                if (_context.Products.Any(p => p.Name == product.Name))
                {
                    return BadRequest("Codigo Existente");
                }
                _context.Products.Add(product);
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
        public async Task<IActionResult> Put(int id, [FromBody] Product product)
        {
            try
            {
                if (id != product.Id)
                {
                    return BadRequest("El id no coincide");
                }
                var productFounded = await _context.Products.FindAsync(id);
                productFounded.Color = product.Color;
                productFounded.Name = product.Name;
                productFounded.Enabled = product.Enabled;
                _context.Update(productFounded);
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
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound();
                }

                product.Enabled = false;
                product.Deleted = true;
                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Eliminado Exitosamente");
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Delete: " + ex.Message);
                return BadRequest("Error on Delete");
            }
        }
    }
}
