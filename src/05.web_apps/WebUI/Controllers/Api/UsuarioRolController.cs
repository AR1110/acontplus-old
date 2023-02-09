using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Api
{
    [AllowAnonymous]
    [Route("apiCliente/[controller]")]
    [ApiController]
    public class UsuarioRolController : ControllerBase
    {
        private readonly ILogger<UsuarioRolController> _logger;
        readonly UsuarioRolDao _urd = new();
        public UsuarioRolController(ILogger<UsuarioRolController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _urd.GetAsync(json));
        }

        [HttpGet]
        [Route("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            return Ok(await _urd.GetIdAsync(id));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] UsuarioRol data)
        {
            return Ok(await _urd.InsertAsync(data));
        }

        [HttpPut]
        [Route("Put/{id}/{codRol}")]
        public async Task<IActionResult> Put(int id, string codRol)
        {
            return Ok(await _urd.UpdateAsync(id, codRol));
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _urd.DeleteAsync(id));
        }
    }
}
