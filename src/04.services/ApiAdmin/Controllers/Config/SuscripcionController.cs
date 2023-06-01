using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApiAdmin.Controllers
{
    [Route("api/[controller]")]
    public class SuscripcionController : ControllerBase
    {
        private readonly ILogger<SuscripcionController> _logger;
        private readonly IConfiguration _config;
        private SuscripcionService _sS;

        public SuscripcionController(ILogger<SuscripcionController> logger, IConfiguration config)
        {
            _config = config;
            _sS = new SuscripcionService(_config);
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _sS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Suscripcion data)
        {
            return Ok(await _sS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(int id, [FromBody] Suscripcion data)
        {
            return Ok(await _sS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _sS.DeleteAsync(id));
        }
    }
}