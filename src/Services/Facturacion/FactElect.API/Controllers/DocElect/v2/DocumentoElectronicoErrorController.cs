using Asp.Versioning;
using Azure;
using Common.Core.Models;
using FactElect.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace FactElect.API.Controllers.DocElect.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]

    public class DocumentoElectronicoErrorController : ControllerBase
    {
        private readonly IDocumentoElectronicoErrorService _factElect;
        private readonly LogWriter _log;

        public DocumentoElectronicoErrorController(IDocumentoElectronicoErrorService factElect, LogWriter log)
        {
            _factElect = factElect;
            _log = log;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    { "id", id}
                };
                var orders = await _factElect.GetAsync(parameters);

                if (orders == null | string.IsNullOrEmpty(orders))
                {
                    return NotFound();
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
