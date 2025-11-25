namespace Vet.Api.Controllers;

public class MedicalHistoryController(IMedicalHistoryRepository historyService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        return Ok(await historyService.GetAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await historyService.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] MedicalHistory medicalHistory)
    {
        medicalHistory.CreatedByUserId = User.GetUserId();
        return Ok(await historyService.AddAsync(medicalHistory));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] MedicalHistory medicalHistory)
    {
        if (id != medicalHistory.Id) return BadRequest("Id no coincide!");

        medicalHistory.UpdatedByUserId = User.GetUserId();
        return Ok(await historyService.UpdateAsync(id, medicalHistory));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await historyService.DeleteAsync(User.GetUserId(), id));
    }
}
