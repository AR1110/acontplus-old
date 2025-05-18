using Microsoft.AspNetCore.Mvc;
using Restaurant.Api.Entities;
using Restaurant.Api.Interfaces;

namespace Restaurant.Api.Controllers;

public class TableController(IAppTableService tableService) : BaseApiController
{
    [HttpGet("GetByEstab/{codEstab}")]
    public async Task<IActionResult> GetByEstab(string codEstab)
    {
        return Ok(await tableService.GetByEstabAsync(SqlStringParam.Sanitize(codEstab)));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] AppTable appTable)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        appTable.UserId = User.GetUserId();

        return Ok(await tableService.AddAsync(appTable));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] AppTable appTable)
    {
        if (id != appTable.Id) return BadRequest();

        appTable.UserId = User.GetUserId();

        return Ok(await tableService.UpdateAsync(id, appTable));
    }

    [HttpPut("Unassign/{id}")]
    public async Task<IActionResult> Unassign(int id)
    {
        return Ok(await tableService.UnassignAsync(User.GetUserId(), id));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await tableService.DeleteAsync(User.GetUserId(), id));
    }
}