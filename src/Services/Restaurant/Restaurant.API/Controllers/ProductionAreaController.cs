using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class ProductionAreaController(IProductionAreaService productionAreaService) : BaseApiController
{
    [HttpGet]
    [Route("Get")]
    public async Task<IActionResult> Get()
    {
        return Ok(await productionAreaService.GetAllAsync());
    }

    [HttpGet("GetByEstab/{establecimientoId}")]
    public async Task<IActionResult> GetByEstab(int establecimientoId)
    {
        return Ok(await productionAreaService.GetByEstabAsync(establecimientoId));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ProductionArea productionArea)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        productionArea.UserId = User.GetUserId();
        return Ok(await productionAreaService.AddAsync(productionArea));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ProductionArea productionArea)
    {
        if (id != productionArea.Id) return BadRequest();
        productionArea.UserId = User.GetUserId();
        return Ok(await productionAreaService.UpdateAsync(id, productionArea));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFloor(int id)
    {
        return Ok(await productionAreaService.DeleteAsync(User.GetUserId(), id));
    }
}
