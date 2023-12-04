using Common.Core.Utils;
using Configuracion.API.Entities;
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
                var response = await _printerService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return NotFound(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var response = await _printerService.GetByIdAsync(id);
                if (response == null) { return NotFound(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get By Id: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Printer printer)
        {
            try
            {
                printer.UserId = User.GetUserId();
                var response = await _printerService.AddAsync(printer);
                if (response == null) { return BadRequest("Can't Save"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Printer printer)
        {
            try
            {
                printer.UserId = User.GetUserId();
                var response = await _printerService.UpdateAsync(id, printer);
                if (response == null) { return BadRequest("Can't Put"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Put: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _printerService.DeleteAsync(id, User.GetUserId());
                if (response == null) { return BadRequest("Can't Delete"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Delete: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
