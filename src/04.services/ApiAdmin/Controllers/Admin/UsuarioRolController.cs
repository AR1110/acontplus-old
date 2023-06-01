using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApiAdmin.Controllers.Admin
{
    [Route("api/[controller]")]
    public class UsuarioRolController : ControllerBase
    {
        private readonly ILogger<UsuarioRolController> _logger;
        private readonly IConfiguration _config;
        private UsuarioRolService _urS;
        public UsuarioRolController(ILogger<UsuarioRolController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _urS = new UsuarioRolService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _urS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public IActionResult Post([FromBody] UsuarioRol data)
        {
            return Ok(_urS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] UsuarioRol data)
        {
            return Ok(await _urS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _urS.DeleteAsync(id));
        }

        [HttpGet]
        [Route("GetByUser")]
        public async Task<IActionResult> GetByUser(string id)
        {
            return Ok(await _urS.GetByUserAsync(id));
        }
    }
}
