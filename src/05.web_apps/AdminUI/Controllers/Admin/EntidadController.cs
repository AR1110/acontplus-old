using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class EntidadController : ControllerBase
    {
        private readonly ILogger<EntidadController> _logger;
        private readonly IConfiguration _config;

        private EntidadService _eS;
        public EntidadController(ILogger<EntidadController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _eS = new EntidadService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _eS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Entidad data)
        {
            return Ok(await _eS.PostAsync(data));
            
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] Entidad data)
        {
            return Ok(await _eS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _eS.DeleteAsync(id));
        }
    }
}
