using Common.Core.Utils;
using Configuracion.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    public class PrinterController : BaseApiController
    {
        private readonly IPrinterService _printerService;
        private readonly LogWriter _log;
        public PrinterController(IPrinterService printerService, LogWriter log)
        {
            _printerService = printerService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _printerService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId()}, { "json", SqlStringParam.Sanitize(json)} });
                if (response == null) { return BadRequest("Can't Get"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
