using Inventario.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Extensions;
using Services.Common.Logs;

namespace Inventario.API.Controllers;

public class StockController : BaseApiController
{
    private readonly ICustomLogger _log;
    private readonly IStockService _stockService;

    public StockController(IStockService stockService, ICustomLogger log)
    {
        _stockService = stockService;
        _log = log;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        try
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
        catch (Exception ex)
        {
            _log.LogActivity("Error on put stock: \n" + ex);
            return BadRequest(ex.Message);
        }
    }
}
