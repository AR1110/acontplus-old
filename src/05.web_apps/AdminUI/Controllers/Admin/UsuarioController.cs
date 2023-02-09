using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly ILogger<UsuarioController> _logger;
        private readonly IConfiguration _config;

        private UsuarioService _uS;
        public UsuarioController(ILogger<UsuarioController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _uS = new UsuarioService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _uS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Usuario data)
        {
            return Ok(await _uS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] Usuario data)
        {
            return Ok(await _uS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _uS.DeleteAsync(id));
        }

        [HttpGet]
        [Route("Search")]
        public async Task<IActionResult> Search(string busqueda)
        {
            return Ok(await _uS.SearchAsync(busqueda));
        }
    }
}
