using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class RoomController(IRoomService roomService) : BaseApiController
{
    [HttpGet]
    [Route("Get")]
    public async Task<IActionResult> Get()
    {
        return Ok(await roomService.GetAllAsync());
    }

    [HttpGet("GetByCode/{codEstab}")]
    public async Task<IActionResult> GetByCode(string codEstab)
    {
        return Ok(await roomService.GetByEstabAsync(codEstab));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Room room)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        room.UserId = User.GetUserId();
        return Ok(await roomService.AddAsync(room));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Room room)
    {
        if (id != room.Id) return BadRequest();
        room.UserId = User.GetUserId();
        return Ok(await roomService.UpdateAsync(id, room));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFloor(int id)
    {
        return Ok(await roomService.DeleteAsync(User.GetUserId(), id));
    }
}
