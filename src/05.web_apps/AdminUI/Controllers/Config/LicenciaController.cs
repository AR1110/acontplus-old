

using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;


namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class LicenciaController : ControllerBase
    {
        private readonly ILogger<LicenciaController> _logger;
        private readonly IConfiguration _config;

        private LicenciaService _lS;
        public LicenciaController(ILogger<LicenciaController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _lS = new LicenciaService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _lS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Licencia data)
        {
            return Ok(await _lS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] Licencia data)
        {
            return Ok(await _lS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _lS.DeleteAsync(id));
        }
    }
}