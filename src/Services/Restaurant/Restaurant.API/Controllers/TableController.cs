using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class TableController(IAppTableService tableService) : BaseApiController
{
    [HttpGet("{codEstab}")]
    public async Task<IActionResult> Get(string codEstab)
    {
        return Ok(await tableService.GetAsync(SqlStringParam.Sanitize(codEstab)));
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
