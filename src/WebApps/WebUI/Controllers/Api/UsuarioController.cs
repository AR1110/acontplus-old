using DataAccess.App;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Api
{
    [AllowAnonymous]
    [Route("apiCliente/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<UsuarioController> _logger;

        private UsuarioDao _u;
        public UsuarioController(ILogger<UsuarioController> logger, IConfiguration config)
        {
            _config = config;
            _u = new UsuarioDao(_config);
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _u.GetAsync(json));
        }

        [HttpGet]
        [Route("Search/{json}")]
        public async Task<IActionResult> Search(string json)
        {
            return Ok(await _u.SearchAsync(json));
        }

        [HttpPost]
        [Route("Post/{json}")]
        public async Task<IActionResult> Post(string json)
        {
            return Ok(await _u.InsertAsync(json));
        }

        [HttpPut]
        [Route("Put/{id}/{json}")]
        public async Task<IActionResult> Put(int id, string json)
        {
            return Ok(await _u.UpdateAsync(id, json));
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _u.DeleteAsync(id));
        }
    }
}
