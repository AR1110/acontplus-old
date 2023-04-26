using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class RolController : ControllerBase
    {
        private readonly ILogger<RolController> _logger;
        private readonly IConfiguration _config;

        private RolService _pS;
        public RolController(ILogger<RolController> logger, IConfiguration config)
        {
            _config = config;
            _pS = new RolService(_config);
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _pS.GetAsync(json));
        }

        [HttpGet]
        [Route("GetId")]
        public async Task<IActionResult> GetId(string ruc)
        {
            return Ok(await _pS.GetAccesAsync(ruc));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Rol data)
        {
            return Ok(await _pS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] Rol data)
        {
            return Ok(await _pS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _pS.DeleteAsync(id));
        }

        [HttpPost]
        [Route("Duplicate")]
        public async Task<IActionResult> Duplicate(string id, [FromBody] Rol data)
        {
            return Ok(await _pS.DuplicateAsync(id, data));
        }
    }
}
