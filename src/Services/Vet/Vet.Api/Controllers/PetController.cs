namespace Vet.Api.Controllers;

public class PetController(IPetRepository petService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await petService.GetAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pet>> GetById(int id)
    {
        return Ok(await petService.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Pet pet)
    {
        pet.CreatedByUserId = User.GetUserId();
        return Ok(await petService.AddAsync(pet));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Pet pet)
    {
        if (id != pet.Id) return BadRequest();

        pet.UpdatedByUserId = User.GetUserId();
        return Ok(await petService.UpdateAsync(id, pet));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await petService.DeleteAsync(User.GetUserId(), id));
    }


    [HttpGet("search")]
    public async Task<ActionResult<SpResponse>> Search(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "companyId", User.GetClaimValue<int>("companyId") },
            { "json", json }
        };
        return await petService.SearchAsync(parameters);
    }
}
