namespace Vet.Api.Controllers;

public class PetTypeController(IPetTypeRepository petTypeService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await petTypeService.GetAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await petTypeService.GetByIdAsync(id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] PetType petType)
    {
        if (id != petType.Id) return BadRequest();
        petType.UpdatedByUserId = User.GetUserId();
        return Ok(await petTypeService.UpdateAsync(id, petType));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] PetType petType)
    {
        petType.CreatedByUserId = User.GetUserId();
        return Ok(await petTypeService.AddAsync(petType));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await petTypeService.DeleteAsync(User.GetUserId(), id));
    }
}
