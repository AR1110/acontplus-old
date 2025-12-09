namespace Vet.Api.Controllers;

public class BreedController(IBreedRepository breedService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await breedService.GetAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await breedService.GetByIdAsync(id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Breed breed)
    {
        if (id != breed.Id) return BadRequest();

        breed.UpdatedByUserId = User.GetUserId();
        return Ok(await breedService.UpdateAsync(id, breed));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Breed breed)
    {
        breed.CreatedByUserId = User.GetUserId();
        return Ok(await breedService.AddAsync(breed));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await breedService.DeleteAsync(User.GetUserId(), id));
    }
}
