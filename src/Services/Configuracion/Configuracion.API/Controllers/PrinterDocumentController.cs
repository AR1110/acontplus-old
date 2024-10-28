namespace Configuracion.API.Controllers;

public class PrinterDocumentController(ConfigContext context) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] PrinterDocument data)
    {
        data.UserId = User.GetUserId();
        await context.PrinterDocuments.AddAsync(data);
        await context.SaveChangesAsync();
        return Ok(new { code = "1", message = "Registrado exitosamente" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] PrinterDocument data)
    {
        if (id != data.Id)
        {
            return BadRequest("Id Incorrecto");
        }

        var document = await context.PrinterDocuments.FindAsync(id);
        document.UserId = User.GetUserId();
        document.Enabled = data.Enabled;
        document.Copies = data.Copies;
        context.Update(document);
        await context.SaveChangesAsync();
        return Ok(new { code = "1", message = "Actualizado exitosamente" });
    }
}
