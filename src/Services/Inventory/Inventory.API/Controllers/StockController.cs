namespace Inventory.Api.Controllers;

public class StockController(IStockService stockService) : BaseApiController
{
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var response =
            await stockService.UpdateAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }
            });
        if (response == null) return BadRequest("Error on put");

        ;
        return Ok(response);
    }
}