using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Customer.Infrastructure.Data;
using Customer.Core.Entities;

namespace Customer.API.Controllers
{
    public class CustomersController : BaseApiController
    {
        private readonly CustomerContext _context;

        public CustomersController(CustomerContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppCustomer>>> GetCustomers()
        {
            if (_context.Customers == null)
            {
                return NotFound();
            }
            // Get the current page number
            int pageNumber = 1;

            // Get the number of products per page
            int pageSize = 50;

            // Get the products for the current page

            return await _context.Customers.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).ToListAsync();
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppCustomer>> GetAppCustomer(int id)
        {
            if (_context.Customers == null)
            {
                return NotFound();
            }
            var appCustomer = await _context.Customers.FindAsync(id);

            if (appCustomer == null)
            {
                return NotFound();
            }

            return appCustomer;
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppCustomer(int id, AppCustomer appCustomer)
        {
            if (id != appCustomer.Id)
            {
                return BadRequest();
            }

            _context.Entry(appCustomer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppCustomerExists(id))
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

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AppCustomer>> PostAppCustomer(AppCustomer appCustomer)
        {
            if (_context.Customers == null)
            {
                return Problem("Entity set 'CustomerContext.Customers'  is null.");
            }
            _context.Customers.Add(appCustomer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppCustomer", new { id = appCustomer.Id }, appCustomer);
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppCustomer(int id)
        {
            if (_context.Customers == null)
            {
                return NotFound();
            }
            var appCustomer = await _context.Customers.FindAsync(id);
            if (appCustomer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(appCustomer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppCustomerExists(int id)
        {
            return (_context.Customers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
