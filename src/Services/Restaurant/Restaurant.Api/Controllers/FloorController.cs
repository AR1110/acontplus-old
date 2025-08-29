using Microsoft.AspNetCore.Mvc;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Repositories;

namespace Restaurant.Api.Controllers;

public class FloorController(IFloorRepository floorService) : BaseApiController
{
    [HttpGet]
    [Route("Get")]
    public async Task<IActionResult> Get()
    {
        return Ok(await floorService.GetAllAsync());
    }

    [HttpGet("GetByEstab/{establecimientoId}")]
    public async Task<IActionResult> GetByEstab(int establecimientoId)
    {
        return Ok(await floorService.GetByEstabAsync(establecimientoId));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Floor floor)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        floor.CreatedByUserId = User.GetUserId();
        return Ok(await floorService.AddAsync(floor));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Floor floor)
    {
        if (id != floor.Id) return BadRequest();
        floor.UpdatedByUserId = User.GetUserId();
        return Ok(await floorService.UpdateAsync(id, floor));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFloor(int id)
    {
        return Ok(await floorService.DeleteAsync(User.GetUserId(), id));
    }
}
