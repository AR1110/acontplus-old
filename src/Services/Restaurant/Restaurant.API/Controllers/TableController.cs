using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Controllers;

public class TableController(IAppTableRepository tableService) : BaseApiController
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

        appTable.CreatedByUserId = User.GetUserId();

        return Ok(await tableService.AddAsync(appTable));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] AppTable appTable)
    {
        if (id != appTable.Id) return BadRequest();

        appTable.UpdatedByUserId = User.GetUserId();

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
