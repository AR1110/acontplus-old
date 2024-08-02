namespace Configuracion.API.Controllers;

public class PrinterController : BaseApiController
{
    private readonly ICustomLogger _log;
    private readonly IPrinterService _printerService;

    public PrinterController(IPrinterService printerService, ICustomLogger log)
    {
        _printerService = printerService;
        _log = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _printerService.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
            if (response == null) { return NotFound(); }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on Get: \n" + ex);
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
            _log.LogActivity("Error on Get By Id: \n" + ex);
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
            _log.LogActivity("Error on Post: \n" + ex);
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
            _log.LogActivity("Error on Put: \n" + ex);
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
            _log.LogActivity("Error on Delete: \n" + ex);
            return BadRequest(ex.Message);
        }
    }
}
