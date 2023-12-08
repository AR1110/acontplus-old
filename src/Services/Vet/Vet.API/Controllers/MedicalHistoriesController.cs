using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Common;
using Vet.API.Data;
using Vet.API.Entities;
using Vet.API.Interfaces;
namespace Vet.API.Controllers
{
    public class MedicalHistoriesController : BaseApiController
    {
        private readonly VetContext _context;
        private IMedicalHistory _medicalHistory;
        public MedicalHistoriesController(VetContext context,
            IMedicalHistory medicalHistory)
        {
            _context = context;
            _medicalHistory = medicalHistory;
        }

        // GET: api/MedicalHistories
        [HttpGet]
        public async Task<ActionResult<APIResponse>> GetMedicalHistories(string json)
        {
            try
            {
                int companyId = Convert.ToInt32(User.GetCompanyId());
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", json }
                };
                return await _medicalHistory.GetAsync(parameters);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET: api/MedicalHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<APIResponse>> GetMedicalHistory(int id)
        {
            //var medicalHistory = await _context.MedicalHistories.FindAsync(id);

            //if (medicalHistory == null)
            //{
            //    return NotFound();
            //}

            //return medicalHistory;
            try
            {
                return await _medicalHistory.GetByIdAsync(id);
            }
            catch (Exception)
            {
                return BadRequest("Error on get by Id");
            }
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

            //_context.Entry(medicalHistory).State = EntityState.Modified;
            var mh = await _context.MedicalHistories.FindAsync(id);
            mh.Date = medicalHistory.Date;
            mh.Observations = medicalHistory.Observations;
            mh.Age = medicalHistory.Age;
            mh.Weight = medicalHistory.Weight;
            mh.UpdatedAt = DateTime.Now;
            mh.CodEstab = medicalHistory.CodEstab;
            mh.UserId = User.GetUserId();

            var pet = await _context.Pets.FindAsync(mh.PetId);

            if (pet != null)
            {
                pet.Age = medicalHistory.Age;
                pet.Weight = medicalHistory.Weight;
            }

            try
            {
                _context.Update(pet);
                await _context.SaveChangesAsync();

                _context.Update(mh);
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
            try
            {
                medicalHistory.UserId = User.GetUserId();
                _context.MedicalHistories.Add(medicalHistory);
                await _context.SaveChangesAsync();

                var pet = await _context.Pets.FindAsync(medicalHistory.PetId);

                if (pet != null)
                {
                    pet.Age = medicalHistory.Age;
                    pet.Weight = medicalHistory.Weight;
                }

                _context.Update(pet);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetMedicalHistory", new { id = medicalHistory.Id }, medicalHistory);
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                return BadRequest("Error al guardar");
            }

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
