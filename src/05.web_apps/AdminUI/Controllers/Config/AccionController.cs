using BL.Admin.Data;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class AccionController : Controller
    {
        private readonly IConfiguration _config;
        private AccionService _aSvc;
        private readonly ILogger<AccionController> _logger;

        public AccionController(ILogger<AccionController> logger, IConfiguration config)
        {
            _config = config;
            _aSvc = new AccionService(_config);
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _aSvc.Get(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post(string json)
        {
            return Ok(await _aSvc.PostAsync(json));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, string json)
        {
            return Ok(await _aSvc.PutAsync(id, json));
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _aSvc.DeleteAsync(id));
        }
    }
}