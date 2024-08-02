namespace Inventario.API.Controllers;

public class StockController : BaseApiController
{

    private readonly IStockService _stockService;

    public StockController(IStockService stockService)
    {
        _stockService = stockService;

    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var response =
            await _stockService.UpdateAsync(new Dictionary<string, object>
            {
                    { "userRoleId", User.GetUserRoleId() }, { "id", id }
            });
        if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Error on put"); }

            ;
        return Ok(response);
    }
}
