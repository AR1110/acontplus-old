using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class AplicacionMenuController : ControllerBase
    {
        private readonly ILogger<AplicacionMenuController> _logger;
        private readonly IConfiguration _config;
        private AplicacionMenuService _amS;
        public AplicacionMenuController(ILogger<AplicacionMenuController> logger, IConfiguration config)
        {
            _config= config;
            _amS = new AplicacionMenuService(_config);
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get( string json)
        {
            return Ok(await _amS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public IActionResult Post([FromBody] AplicacionMenu data)
        {
            return Ok(_amS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] AplicacionMenu data)
        {
            return Ok(await _amS.PutAsync(id,data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _amS.DeleteAsync(id));
        }
    }
}