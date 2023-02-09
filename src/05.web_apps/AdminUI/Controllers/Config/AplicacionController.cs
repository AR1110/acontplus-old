using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;
namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class AplicacionController : ControllerBase
    {
        private readonly ILogger<AplicacionController> _logger;
        private readonly IConfiguration _config;

        private AplicacionService _aS;
        public AplicacionController(ILogger<AplicacionController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _aS = new AplicacionService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _aS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Aplicacion data)
        {
            return Ok(await _aS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] Aplicacion data)
        {
            return Ok(await _aS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _aS.DeleteAsync(id));
        }
    }
}