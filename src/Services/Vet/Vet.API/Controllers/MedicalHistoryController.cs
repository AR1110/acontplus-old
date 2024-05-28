namespace Vet.API.Controllers;

public class MedicalHistoryController(IMedicalHistory history) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetMedicalHistories(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", json } };
        return Ok(await history.GetAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await history.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<ActionResult<MedicalHistory>> Post([FromBody] MedicalHistory medicalHistory)
    {
        medicalHistory.UserId = User.GetUserId();
        return Ok(await history.AddAsync(medicalHistory));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] MedicalHistory medicalHistory)
    {
        if (id != medicalHistory.Id)
        {
            return BadRequest("Id no coincide!");
        }

        medicalHistory.UserId = User.GetUserId();
        return Ok(await history.UpdateAsync(id, medicalHistory));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await history.DeleteAsync(User.GetUserId(), id));
    }
}
