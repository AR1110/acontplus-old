using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class FloorController(IFloorService floorService) : BaseApiController
{
    [HttpGet]
    [Route("Get")]
    public async Task<IActionResult> Get()
    {
        return Ok(await floorService.GetAllAsync());
    }

    [HttpGet("GetByCode/{codEstab}")]
    public async Task<IActionResult> GetByCode(string codEstab)
    {
        return Ok(await floorService.GetByEstabAsync(codEstab));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Floor floor)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        floor.UserId = User.GetUserId();
        return Ok(await floorService.AddAsync(floor));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Floor floor)
    {
        if (id != floor.Id) return BadRequest();
        floor.UserId = User.GetUserId();
        return Ok(await floorService.UpdateAsync(id, floor));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFloor(int id)
    {
        return Ok(await floorService.DeleteAsync(User.GetUserId(), id));
    }
}
