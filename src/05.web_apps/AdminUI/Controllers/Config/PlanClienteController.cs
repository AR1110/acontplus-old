using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class PlanClienteController : ControllerBase
    {
        private readonly ILogger<PlanClienteController> _logger;
        private readonly IConfiguration _config;
        private PlanClienteService _pS;
        public PlanClienteController(ILogger<PlanClienteController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _pS = new PlanClienteService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _pS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] PlanCliente data)
        {
            return Ok(await _pS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] PlanCliente data)
        {
            return Ok(await _pS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _pS.DeleteAsync(id));
        }

    }
}