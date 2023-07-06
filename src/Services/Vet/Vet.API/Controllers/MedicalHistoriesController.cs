using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common;
using Vet.Core.Entities;
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.API.Controllers
{
    public class MedicalHistoriesController : BaseApiController
    {
        private readonly VetContext _context;
        private readonly IMedicalHistoryReport _medicalHistoryReport;
        private IMedicalHistory _medicalHistory;
        public MedicalHistoriesController(VetContext context,
            IMedicalHistoryReport medicalHistoryReport,
            IMedicalHistory medicalHistory)
        {
            _context = context;
            _medicalHistoryReport = medicalHistoryReport;
            _medicalHistory = medicalHistory;
        }

        // GET: api/MedicalHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalHistory>>> GetMedicalHistories()
        {
            int companyId = Convert.ToInt32(User.GetCompanyId());
            var apiRequest = new ApiRequest();

            var dictionary = new Dictionary<string, object>
            {
                { "id", companyId }
            };
            apiRequest.Data = dictionary;

            var result = _medicalHistory.Get(apiRequest);
            if (!_context.MedicalHistories.Any(x =>
                                            x.Pet.CompanyId == companyId
                                            && x.Enabled
                                            ))
            {
                return NoContent();
            }
            return await _context.MedicalHistories.Include(p => p.Pet)
                .Where(x => x.Pet.CompanyId == companyId && x.Enabled)
                .ToListAsync();
        }

        // GET: api/MedicalHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalHistory>> GetMedicalHistory(int id)
        {
            var medicalHistory = await _context.MedicalHistories.FindAsync(id);

            if (medicalHistory == null)
            {
                return NotFound();
            }

            return medicalHistory;
        }

        [HttpPost("Report/{id}")]
        public IActionResult GetReport(int id)
        {
            //var medicalHistory = await _context.MedicalHistories.FindAsync(id);

            //if (medicalHistory == null)
            //{
            //    return NotFound();
            //}

            var data = _medicalHistoryReport.Get(id);

            return File(data, "application/pdf", "test.pdf");
        }

        // PUT: api/MedicalHistories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicalHistory(int id, MedicalHistory medicalHistory)
        {
            if (id != medicalHistory.Id)
            {
                return BadRequest();
            }

            _context.Entry(medicalHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicalHistoryExists(id))
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

        // POST: api/MedicalHistories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MedicalHistory>> PostMedicalHistory(MedicalHistory medicalHistory)
        {
            _context.MedicalHistories.Add(medicalHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMedicalHistory", new { id = medicalHistory.Id }, medicalHistory);
        }

        // DELETE: api/MedicalHistories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalHistory(int id)
        {
            var medicalHistory = await _context.MedicalHistories.FindAsync(id);
            if (medicalHistory == null)
            {
                return NotFound();
            }

            //_context.MedicalHistories.Remove(medicalHistory);
            //await _context.SaveChangesAsync();

            medicalHistory.Deleted = true;
            medicalHistory.Enabled = false;

            _context.Entry(medicalHistory).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MedicalHistoryExists(int id)
        {
            return _context.MedicalHistories.Any(e => e.Id == id);
        }
    }
}
