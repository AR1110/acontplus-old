using DataAccess.Aplicacion;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Api
{
    [AllowAnonymous]
    [Route("apiCliente/[controller]")]
    [ApiController]
    public class EntidadController : ControllerBase
    {
        private readonly ILogger<EntidadController> _logger;

        readonly EntidadDao _e = new();

        public EntidadController(ILogger<EntidadController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _e.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Entidad data)
        {
            return Ok(await _e.InsertAsync(data));
        }

        [HttpPut]
        [Route("Put/{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Entidad data)
        {
            return Ok(await _e.UpdateAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _e.DeleteAsync(id));
        }



    }
}
