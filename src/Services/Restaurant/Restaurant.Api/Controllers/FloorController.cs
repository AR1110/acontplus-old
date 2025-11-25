using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Controllers;

public class FloorController(IFloorRepository floorRepository) : BaseApiController
{
    [HttpGet]
    [Route("Get")]
    public async Task<IActionResult> Get()
    {
        return Ok(await floorRepository.GetAllAsync());
    }

    [HttpGet("GetByEstab/{establecimientoId}")]
    public async Task<IActionResult> GetByEstab(int establecimientoId)
    {
        return Ok(await floorRepository.GetByEstabAsync(establecimientoId));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Floor floor)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        floor.CreatedByUserId = User.GetUserId();
        return Ok(await floorRepository.AddAsync(floor));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Floor floor)
    {
        if (id != floor.Id) return BadRequest();
        floor.UpdatedByUserId = User.GetUserId();
        return Ok(await floorRepository.UpdateAsync(id, floor));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFloor(int id)
    {
        return Ok(await floorRepository.DeleteAsync(User.GetUserId(), id));
    }
}
