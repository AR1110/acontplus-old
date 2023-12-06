using Common.Core.Models;
using DataAccess;
using FactElect.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace FactElect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoElectronicoErrorController : ControllerBase
    {
        private readonly IDocumentoElectronicoErrorService _docElect;
        private readonly LogWriter _log;
        public DocumentoElectronicoErrorController(IDocumentoElectronicoErrorService docElect, LogWriter log)
        {

            _docElect = docElect;
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
                var orders = await _docElect.GetAsync(parameters);

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
