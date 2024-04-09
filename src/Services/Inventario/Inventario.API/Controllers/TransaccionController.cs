using Common.Core.Utils;
using Inventario.API.Dtos;
using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    public class TransaccionController : BaseApiController
    {
        private readonly ITransaccionService _transaccionService;
        private readonly ICustomLogger _logWriter;
        public TransaccionController(ITransaccionService transaccionService, ICustomLogger logWriter)
        {
            _transaccionService = transaccionService;
            _logWriter = logWriter;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _transaccionService.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity("Error en Obtener Transferencias de bodegas" + ex.Message);
                return BadRequest("Error en get Transferencias de bodegas" + ex.Message);
            }
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
