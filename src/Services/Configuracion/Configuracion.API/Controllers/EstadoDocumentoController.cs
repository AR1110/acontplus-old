using Configuracion.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    public class EstadoDocumentoController : BaseApiController
    {
        private readonly IEstadoDocumentoService _estadoDoc;
        private readonly LogWriter _logWriter;
        public EstadoDocumentoController(IEstadoDocumentoService estadoDocumento, LogWriter log)
        {
            _estadoDoc = estadoDocumento;
            _logWriter = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _estadoDoc.GetAsync(json);
                if (response.code == "1")
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest("No data");
                }
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity("Error on Get: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
