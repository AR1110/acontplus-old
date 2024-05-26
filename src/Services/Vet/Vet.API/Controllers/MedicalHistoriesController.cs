namespace Vet.API.Controllers;

public class MedicalHistoriesController : BaseApiController
{
    private readonly VetContext _context;
    private readonly IMedicalHistory _medicalHistory;

    public MedicalHistoriesController(VetContext context, IMedicalHistory medicalHistory)
    {
        _context = context;
        _medicalHistory = medicalHistory;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse>> GetMedicalHistories(string json)
    {
        var companyId = Convert.ToInt32(User.GetCompanyId());
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", json } };
        return await _medicalHistory.GetAsync(parameters);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse>> GetMedicalHistory(int id)
    {
        return await _medicalHistory.GetByIdAsync(id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutMedicalHistory(int id, MedicalHistory medicalHistory)
    {
        if (id != medicalHistory.Id)
        {
            return BadRequest();
        }

        var mh = await _context.MedicalHistories.FindAsync(id);
        mh.Date = medicalHistory.Date;
        mh.Observations = medicalHistory.Observations;
        mh.Age = medicalHistory.Age;
        mh.Weight = medicalHistory.Weight;
        mh.UpdatedAt = DateTime.Now;
        mh.CodEstab = medicalHistory.CodEstab;
        mh.UserId = User.GetUserId();

        _context.Update(mh);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<MedicalHistory>> PostMedicalHistory(MedicalHistory medicalHistory)
    {
        try
        {
            medicalHistory.UserId = User.GetUserId();
            _context.MedicalHistories.Add(medicalHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMedicalHistory", new { id = medicalHistory.Id }, medicalHistory);
        }
        catch (Exception)
        {
            return BadRequest("Error al guardar");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicalHistory(int id)
    {
        var medicalHistory = await _context.MedicalHistories.FindAsync(id);
        if (medicalHistory == null)
        {
            return NotFound();
        }

        medicalHistory.Deleted = true;
        medicalHistory.Enabled = false;

        _context.Entry(medicalHistory).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok();
    }

    private bool MedicalHistoryExists(int id)
    {
        return _context.MedicalHistories.Any(e => e.Id == id);
    }
}
