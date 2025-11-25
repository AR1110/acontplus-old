using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Controllers;

public class RoomController(IRoomRepository roomService) : BaseApiController
{
    [HttpGet]
    [Route("Get")]
    public async Task<IActionResult> Get()
    {
        return Ok(await roomService.GetAllAsync());
    }

    [HttpGet("GetByEstab/{establecimientoId}")]
    public async Task<IActionResult> GetByCode(int establecimientoId)
    {
        return Ok(await roomService.GetByEstabAsync(establecimientoId));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Room room)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        room.CreatedByUserId = User.GetUserId();
        return Ok(await roomService.AddAsync(room));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Room room)
    {
        if (id != room.Id) return BadRequest();
        room.UpdatedByUserId = User.GetUserId();
        return Ok(await roomService.UpdateAsync(id, room));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFloor(int id)
    {
        return Ok(await roomService.DeleteAsync(User.GetUserId(), id));
    }
}
