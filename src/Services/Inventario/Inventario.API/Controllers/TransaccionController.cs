using Common.Core.Interfaces;
using Inventario.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    public class TransaccionController : BaseApiController
    {
        private readonly ITransaccionService _transaccionService;
        private readonly LogWriter _logWriter;
        public TransaccionController(ITransaccionService transaccionService, LogWriter logWriter)
        {
            _transaccionService = transaccionService;
            _logWriter = logWriter;
        }
        [HttpPost]
        public IActionResult Post([FromBody] TransaccionDto data)
        {
            try
            {
                _transaccionService.Process(new Dictionary<string, object> { { "codTran", data.CodTran }, { "codDoc", data.CodDoc }, { "documentoId", data.DocumentoId }, { "tipo", data.Tipo } });
                return Ok("Successful");
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity("Error activating inventario transacction handler: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
