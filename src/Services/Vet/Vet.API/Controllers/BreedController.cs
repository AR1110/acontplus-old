namespace Vet.API.Controllers;

public class BreedController(IBreedService breedService) : BaseApiController
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
    public async Task<IActionResult> Put(int id, Breed breed)
    {
        if (id != breed.Id)
        {
            return BadRequest();
        }
        return Ok(await breedService.UpdateAsync(id, breed));
    }

    [HttpPost]
    public async Task<IActionResult> Post(Breed breed)
    {
        return Ok(await breedService.AddAsync(breed));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await breedService.DeleteAsync(User.GetUserId(), id));
    }
}
