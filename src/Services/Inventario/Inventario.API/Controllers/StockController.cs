using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    public class StockController : BaseApiController
    {
        private readonly IStockService _stockService;
        private readonly LogWriter _log;
        public StockController(IStockService stockService, LogWriter log)
        {
            _stockService = stockService;
            _log = log;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id)
        {
            try
            {
                var response = await _stockService.UpdateAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Error on put"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on put stock: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
