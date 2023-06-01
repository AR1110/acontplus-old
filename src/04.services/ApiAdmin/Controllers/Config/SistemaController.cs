using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;



namespace ApiAdmin.Controllers
{
    [Route("api/[controller]")]
    public class SistemaController : ControllerBase
    {
        private readonly IConfiguration _config;
        private SistemaService _sS;
        private readonly ILogger<SistemaController> _logger;

        public SistemaController(ILogger<SistemaController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _sS = new SistemaService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _sS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Sistema data)
        {
            return Ok(await _sS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] Sistema data)
        {
            return Ok(await _sS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _sS.DeleteAsync(id));
        }
    }
}