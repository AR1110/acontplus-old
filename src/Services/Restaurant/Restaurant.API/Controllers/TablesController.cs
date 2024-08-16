using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class TablesController(IAppTableService tableService) : BaseApiController
{
    [HttpGet("GetAll/{codEstab}")]
    public async Task<ActionResult<Dictionary<string, object>>> Get(string codEstab)
    {
        return Ok(await tableService.GetAsync(codEstab));
    }

    // [HttpGet("GetByCode/{codEstab}")]
    // public async Task<ActionResult<IEnumerable<AppTable>>> GetByCode(string codEstab)
    // {
    //     return await context.Tables.Include(x => x.Room)
    //         .Where(x => x.Room.Floor.CodEstab == codEstab && x.Deleted == null).ToListAsync();
    // }

    [HttpPost]
    public async Task<ActionResult<AppTable>> Post(AppTable appTable)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        appTable.UserId = User.GetUserId();

        return Ok(await tableService.AddAsync(appTable));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, AppTable appTable)
    {
        if (id != appTable.Id) return BadRequest();

        appTable.UserId = User.GetUserId();

        return Ok(await tableService.UpdateAsync(id, appTable));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTable(int id)
    {
        return Ok(await tableService.DeleteAsync(User.GetUserId(), id));
    }
}
