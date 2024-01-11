using Configuracion.API.Data;
using Configuracion.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    public class PrinterDocumentController : BaseApiController
    {
        private readonly ConfigContext _context;
        private readonly LogWriter _log;
        public PrinterDocumentController(ConfigContext context, LogWriter log)
        {
            _context = context;
            _log = log;
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PrinterDocument data)
        {
            try
            {
                data.UserId = User.GetUserId();
                await _context.PrinterDocuments.AddAsync(data);
                await _context.SaveChangesAsync();
                return Ok(new { code = "1", message = "Registrado exitosamente" });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] PrinterDocument data)
        {
            try
            {
                if (id != data.Id)
                {
                    return BadRequest("Id Incorrecto");
                }
                var document = await _context.PrinterDocuments.FindAsync(id);
                document.UserId = User.GetUserId();
                document.Enabled = data.Enabled;
                document.Copies = data.Copies;
                _context.Update(document);
                await _context.SaveChangesAsync();
                return Ok(new { code = "1", message = "Actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Put: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
