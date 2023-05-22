using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class AsignacionController : ControllerBase
    {
        private readonly ILogger<AsignacionController> _logger;
        private readonly IConfiguration _config;

        private AsignacionService _aS;
        public AsignacionController(ILogger<AsignacionController> logger, IConfiguration config)
        {
            _config = config;
            _aS = new AsignacionService(_config);
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _aS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Asignacion data)
        {
            return Ok(await _aS.PostAsync(data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _aS.DeleteAsync(id));
        }
    }
}
