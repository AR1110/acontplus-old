namespace Configuracion.API.Controllers;

public class PrinterController(IPrinterService printerService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await printerService.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
        if (response == null) { return NotFound(); }

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var response = await printerService.GetByIdAsync(id);
        if (response == null) { return NotFound(); }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Printer printer)
    {
        printer.UserId = User.GetUserId();
        var response = await printerService.AddAsync(printer);
        if (response == null) { return BadRequest("Can't Save"); }

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Printer printer)
    {
        printer.UserId = User.GetUserId();
        var response = await printerService.UpdateAsync(id, printer);
        if (response == null) { return BadRequest("Can't Put"); }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await printerService.DeleteAsync(id, User.GetUserId());
        if (response == null) { return BadRequest("Can't Delete"); }

        return Ok(response);
    }
}
