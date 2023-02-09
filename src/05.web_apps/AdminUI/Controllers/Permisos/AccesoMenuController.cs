using BL.Admin.Data;
using Domain.Admin.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class AccesoMenuController : ControllerBase
    {
        private readonly ILogger<AccesoMenuController> _logger;
        private readonly IConfiguration _config;
        private AccesoMenuService _amS;
        public AccesoMenuController(ILogger<AccesoMenuController> logger, IConfiguration config)
        {
            _config = config;
            _amS = new AccesoMenuService(_config);
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _amS.GetAsync(json));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put([FromBody] ApiAccessParam data)
        {
            return Ok(await _amS.PutAsync(data));
        }
    }
}
