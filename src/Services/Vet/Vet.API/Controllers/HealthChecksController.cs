using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vet.Core.Entities;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthChecksController : ControllerBase
    {
        private readonly VetContext _context;

        public HealthChecksController(VetContext context)
        {
            _context = context;
        }

        // GET: api/HealthChecks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HealthCheck>>> GetHealthChecks()
        {
            return await _context.HealthChecks.ToListAsync();
        }

        // GET: api/HealthChecks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HealthCheck>> GetHealthCheck(int id)
        {
            var healthCheck = await _context.HealthChecks.FindAsync(id);

            if (healthCheck == null)
            {
                return NotFound();
            }

            return healthCheck;
        }

        // PUT: api/HealthChecks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHealthCheck(int id, HealthCheck healthCheck)
        {
            if (id != healthCheck.Id)
            {
                return BadRequest();
            }
            var healthCheckFounded = await _context.HealthChecks.FindAsync(id);
            healthCheckFounded.DiseaseId = healthCheck.DiseaseId;
            healthCheckFounded.DiseaseStatusId = healthCheck.DiseaseStatusId;
            healthCheckFounded.UpdatedAt = DateTime.Now;
            //_context.Entry(healthCheck).State = EntityState.Modified;

            try
            {
                _context.Update(healthCheckFounded);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HealthCheckExists(id))
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

        // POST: api/HealthChecks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<HealthCheck>> PostHealthCheck(HealthCheck healthCheck)
        {
            _context.HealthChecks.Add(healthCheck);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHealthCheck", new { id = healthCheck.Id }, healthCheck);
        }

        // DELETE: api/HealthChecks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheck(int id)
        {
            var healthCheck = await _context.HealthChecks.FindAsync(id);
            if (healthCheck == null)
            {
                return NotFound();
            }

            _context.HealthChecks.Remove(healthCheck);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HealthCheckExists(int id)
        {
            return _context.HealthChecks.Any(e => e.Id == id);
        }
    }
}
